/** @param {NS} ns **/

/*
	TODO
	- crashes when all servers are farmed
	- distribute threads more efficiently
*/

import {serverInfo} from "/cache/augment/serverInfo.js"
import {printObjArray, getRootServers} from "/lib/lib.js"
import {isBeingFarmed} from "/lib/farm.js"

const scripts = 
[
	"/farm/smart/smart-hack-cheap.js",
	"/farm/smart/smart-grow-cheap.js",
	"/farm/smart/smart-weak-cheap.js",
]

// calcs # of grow threads needed to max money on a server
// TODO: currently doesn't apply the static +cash from grow()
function calcGrowThreadsMax(ns, server, player, cores = 1)
{
	const growFactor = server.moneyMax / server.moneyAvailable;
	const base = ns.formulas.hacking.growPercent(server, 1, player, cores);
	return Math.ceil(Math.log(growFactor) / Math.log(base));
}

function calcRamCost(ns, scripts, threads, host = "home")
{
	return threads.reduce((total, count, i) => total += count * ns.getScriptRam(scripts[i], host), 0);
}

// calcs optimal hgw threads for server, assuming it starts at min/max
// TODO: currently doesn't apply the static +cash from grow()
function calcThreads(ns, server, player, budget, cores = 1)
{
	let cost = 0;
	let farmInfo = null;
	const singleHackSteal = ns.formulas.hacking.hackPercent(server, player);
	const maxHackThreads = Math.floor(1 / singleHackSteal);
	ns.tprint(maxHackThreads);
	for(let hackThreads = 1 ; hackThreads < maxHackThreads ; hackThreads++)
	{
		// simulate hack
		server.hackDifficulty = server.minDifficulty + hackThreads * .002; // TODO: use hackanalyzesecurity()?
		const hackSteal = hackThreads * singleHackSteal;
		const moneyStolen = server.moneyMax * hackSteal;
		server.moneyAvailable = server.moneyMax - moneyStolen;
		// simulate grow
		const growThreads = calcGrowThreadsMax(ns, server, player, cores);
		server.hackDifficulty += growThreads * 0.004;
		// calc weak threads
		const singleWeakAmount = ns.weakenAnalyze(1, cores); // TODO: just use formula from source?
		const weakThreads = Math.ceil((server.hackDifficulty - server.minDifficulty) / singleWeakAmount);
		const weakTime = ns.formulas.hacking.weakenTime({...server, hackDifficulty: server.minDifficulty}, player);

		cost = calcRamCost(ns, scripts, [hackThreads, growThreads, weakThreads]);
		if(cost < budget) farmInfo =
		{
			hackThreads: hackThreads,
			growThreads: growThreads,
			weakThreads: weakThreads,
			moneyStolen: moneyStolen,
			time: weakTime,
			hostname: server.hostname
		};
		else return farmInfo;
	}
	return farmInfo;
}

function printThreads(ns, threads)
{
	if(!threads) return;
	ns.tprint("h/g/w: " + threads.h + "/" + threads.g + "/" + threads.w);
	ns.tprint("expected $/s: " + ns.nFormat(threads.stolen / threads.time, "0.00a"));
}

function genHostArray(ns)
{
	const fullInfo = getRootServers(ns).map(hostname => ns.getServer(hostname));
	let hostInfo = fullInfo.map(info => ({
		hostname: info.hostname,
		ram: info.maxRam - info.ramUsed,
		cors: info.cpuCores
	}));
	hostInfo.sort((a, b) => a.ram > b.ram ? -1 : 1);
	return hostInfo;
}

// consolidate budget + cores into host?
function genFarmArray(ns, player, budget, cores)
{
	let farmInfos = [];
	for(const server of serverInfo.filter(
		s => player.hacking >= s.requiredHackingSkill
		&& s.moneyMax > 0
		&& !isBeingFarmed(ns, s.hostname)
		&& ns.hasRootAccess(s.hostname)
	))
	{
		const farmInfo = calcThreads(ns, server, player, budget, cores);
		farmInfos.push(farmInfo);
	}
	farmInfos.sort((a,b) => a.moneyStolen / a.time > b.moneyStolen / b.time ? -1 : 1);
	return farmInfos;
}

// consolidate budget + cores into host?
function calcBestTarget(ns, player, budget, cores)
{
	return genFarmArray(ns, player, budget, cores)[0];
}

async function copyExec(ns, script, host, threads, ...args)
{
	if(host != "home") await ns.scp(script, "home", host);
	ns.exec(script, host, threads, ...args);
}

export async function main(ns)
{
	for(const hostInfo of genHostArray(ns))
	{
		const host = hostInfo.hostname;
		const budget = hostInfo.ram;
		const cores = hostInfo.cores;
		const player = ns.getPlayer();
		const targetInfo = calcBestTarget(ns, player, budget, cores);
		await copyExec(ns, scripts[0], host, targetInfo.hackThreads, targetInfo.hostname);
		await ns.sleep(150);
		await copyExec(ns, scripts[1], host, targetInfo.growThreads, targetInfo.hostname);
		await ns.sleep(150);
		await copyExec(ns, scripts[2], host, targetInfo.weakThreads, targetInfo.hostname);
	}
}