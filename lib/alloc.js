/** @param {NS} ns **/
import {getRootServers} from "/lib/lib.js"

const homeReservedRam = 32 - 5;

export function genFreeRamArray(ns)
{
	const servers = getRootServers(ns);
	let server_rams = servers.map(s => ({
		hostname: s,
		freeRam: ns.getServerMaxRam(s) - ns.getServerUsedRam(s)
	}));
	//ns.tprint(server_rams);
	return server_rams;
}


export function getFreeRam(ns, host)
{
	const reservedRam = getReservedRam(ns, host);
	const maxRam = ns.getServerMaxRam(host)
	const usedRam = ns.getServerUsedRam(host);
	return maxRam - usedRam - reservedRam;
}


export function getReservedRam(ns, host)
{
	const reservedRam = host == "home" ? homeReservedRam : 0;
	return reservedRam;
}


export function calcMaxThreads(ns, host, script)
{
	const cost = ns.getScriptRam(script);
	const ram = getFreeRam(ns, host);
	const threads = Math.floor(ram / cost);
	return threads;
}


function getBestHost(freeRamArray, allocSize)
{
	let bestFit = null;
	let best_slack = Infinity;
	
	for(const hostRam of freeRamArray)
	{
		const slack = hostRam.freeRam - allocSize;
		if(hostRam.freeRam >= allocSize && slack < best_slack)
		{
			bestFit = hostRam;
			best_slack = slack;
		}
	}
	return bestFit;
}

// returns a server that has enough space, or null if none
export function alloc(ns, size)
{
	const bestHost = getBestHost(genFreeRamArray(ns), size);
	if(bestHost) return bestHost.hostname;
	else return null;
}

// takes an array of desired blocks as input
// returns array of hosts, same order as input
// or null if not all blocks can be satisfied
export function allocMultiple(ns, rams)
{
	let ramArray = genFreeRamArray(ns);
	//ns.tprint(ramArray);
	//ns.tprint(rams.length);
	let output = Array(rams.length);
	for(let i = 0 ; i < rams.length ; i++)
	{
		//ns.tprint(i);
		let bestHost = getBestHost(ramArray, rams[i]);
		if(bestHost == null) return null;
		bestHost.freeRam -= rams[i];
		output[i] = bestHost.hostname;
		ramArray.filter(r => r.hostname == output[i])[0] -= rams[i];
	}
	return output;
}


export function maxThreadsDistributed(ns, script)
{
	const hosts = getRootServers(ns);
	const totalThreads = hosts.reduce((total, host) => total += calcMaxThreads(ns, host, script), 0);
	return totalThreads;
}

export async function execSafe(ns, host, script, threads = 1, ...args)
{
	if(threads > 0)
	{	
		await copyLibs(ns, host);
		await ns.scp(script, host);
		return ns.exec(script, host, threads, ...args);
	}
	return null;
}

export async function copyLibs(ns, target)
{
	if(target != "home")
	{
		const libDir = "/lib/";
		const files = ns.ls("home").filter(fn => fn.startsWith(libDir));
		for(const file of files) await ns.scp(file, target);
	}
}


// distributes threads among available hosts
// returns pid array of processes, or null if unable
// TODO: CLEAN UP
export async function distribute(ns, script, threads, ...args)
{
	if(threads <= 0) return null;
	const hosts = getRootServers(ns);
	let hostMaxThreads = hosts.map((host) => ({name: host,maxThreads: calcMaxThreads(ns, host, script)})).filter((host) => host.maxThreads > 0);
	// check if it's possible to start this many threads
	const totalMaxThreads = hostMaxThreads.reduce((total, host) => total += host.maxThreads, 0);
	//ns.tprint(script + " : " + totalMaxThreads + " : " + threads)
	if(threads > totalMaxThreads) return null;
	// start running scripts
	let pids = [];
	hostMaxThreads.sort((a, b) => a.maxThreads < b.maxThreads ? -1 : 1);
	for(const host of hostMaxThreads)
	{
		const hostThreads = Math.min(threads, host.maxThreads);
		const pid = await execSafe(ns, host.name, script, hostThreads, ...args);
		if(pid == 0)
		{
			ns.tprint("failed to start for (" + script + " , " + threads + "). host: " + host.name + " can hold " + host.maxThreads + ". requested " + hostThreads + ". args: " + args);
			break;
		}
		pids.push(pid);
		threads -= hostThreads;
		if(threads == 0) return pids;
	}
	ns.tprint("alloc.js/distribute() : you done goofed. totalMax : " + totalMaxThreads + ". requested: " + threads);
	return pids;
}

export async function main(ns)
{
	const host1 = alloc(ns, 512);
	ns.tprint(host1);
	const hosts = allocMultiple(ns, [1, 2000, 2000, 2000, 2000, 9000]);
	ns.tprint(hosts);
	//ns.tprint(alloc(ns, ns.args[0]));
}