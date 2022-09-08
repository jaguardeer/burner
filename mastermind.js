/** @param {NS} ns **/

import {getRootServers} from "/lib/lib.js"
import {nukeAll} from "/lib/nuke.js"
import {buyExploits} from "/buy-exploits.js"
import {execSafe, calcMaxThreads} from "/lib/alloc.js"


// total available ram from all servers
function availableRam(ns)
{
	const freeRam = (host) => ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	return getRootServers(ns).reduce((total, host) => total += freeRam(host), 0);
}

async function execAllMax(ns, script, ...args)
{
	let pids = [];
	const hosts = getRootServers(ns);
	for(const host of hosts)
	{
		const hostRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
		const scriptRam = ns.getScriptRam(script);
		const threads = Math.floor(hostRam / scriptRam);
		if(threads > 0)	pids.push(await execSafe(ns, host, script, threads, ...args));
	}
	return pids;
}

function tryWorkForDaedalus(ns)
{
	const factions = ["ECorp", "Daedalus"];
	for(const faction of factions)
	{
		if(ns.joinFaction(faction))
		{
			ns.workForFaction(faction, "hacking", true);
			return;
		}
	}
}

async function delayForStudy(ns)
{
	ns.travelToCity("Volhaven");
	const success = ns.universityCourse("zb institute of technology", "algorithms", true);
	if(!success) {ns.tprint("error: couldn't study"); return}
	const delta = 2000;
	let weakTimePrev = ns.getWeakenTime("n00dles");
	let weakTimeNow = ns.getWeakenTime("n00dles") - delta - 1;
	ns.print("studying a bit");
	while(weakTimePrev - weakTimeNow > delta)
	{
		weakTimePrev = ns.getWeakenTime("n00dles");
		await ns.sleep(2000);
		weakTimeNow = ns.getWeakenTime("n00dles");
	}
}

import {setTask} from "/gang/set-task.js"

export async function main(ns)
{
	// start moneymakers (gang + sleeve)
	//ns.run("/sleeve/money.js");
	for(let i = 0 ; i < ns.sleeve.getNumSleeves() ; i++) ns.sleeve.setToUniversityCourse(i, "zb institute of technology", "algorithms");
	setTask(ns, "Human Trafficking");
	//return;
	// study, then get exp script going
	nukeAll(ns);
	await delayForStudy(ns);
	await execAllMax(ns, "/daemon/security.js");
	await ns.sleep(15 * 1000);
	buyExploits(ns);
	await ns.sleep(250);
	nukeAll(ns);
	for(let i = 0 ; i < ns.sleeve.getNumSleeves() ; i++) ns.sleeve.setToCommitCrime(i, "homicide");
	// kill exp script, farm
	ns.kill(ns.ps("home").find(proc => proc.filename == "/daemon/security.js").pid);
	ns.run("spam-smart.js");
	//setTask(ns, "Train Combat");
	//ns.run("/gang/ascend.js", 1, 1.04);
}