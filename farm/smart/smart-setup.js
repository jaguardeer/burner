/** @param {NS} ns **/
export function autocomplete(data,args){return [...data.servers];}

import {getRootServers} from "/lib/lib.js";
import {calcValue, calcThreads, calcRam, scripts, isBeingFarmed} from "/farm/smart/smart-lib.js"
import {allocMultiple, alloc} from "/lib/alloc.js"
import {calcWeakThreads} from "/lib/farm.js"


// return null if no host found, otherwise result of ns.exec()
async function clearSecurity(ns, target)
{
	const weakScript = "/farm/single/weak.js";
	const weakThreads = calcWeakThreads(ns, target);
	if(weakThreads == 0) return null;
	const weakRam = weakThreads * ns.getScriptRam(weakScript, "home");
	const weakHost = alloc(ns, weakRam);
	if(weakHost == null) return null;
	else{
		if(weakHost != "home") await ns.scp(weakScript, "home", weakHost);
		return ns.exec(weakScript, weakHost, weakThreads, target);
	}
}

async function launchFarmThreads(ns, target)
{

}

async function farm_target(ns, target)
{
	let logString = "considering " + target + ": ";
	if(calcWeakThreads(ns, target) > 0) return clearSecurity(ns, target);
	const threads = calcThreads(ns, target);
	logString += Object.values(threads).join("/") + " h/g/w";
	ns.print(logString);
	const ramCost = calcRam(ns, threads);
	ns.print(Object.values(ramCost).join("/"));
	const hosts = allocMultiple(ns, [ramCost.hackRam, ramCost.growRam, ramCost.weakRam]);
	if(hosts == null)
	{
		ns.print("couldn't find hosts");
		return;
	}
	const hackHost = hosts[0];
	const growHost = hosts[1];
	const weakHost = hosts[2];

	if(hosts[0] != "home") await ns.scp(scripts.hackScript, hosts[0]);
	if(hosts[1] != "home") await ns.scp(scripts.growScript, hosts[1]);
	if(hosts[2] != "home") await ns.scp(scripts.weakScript, hosts[2]);

	await ns.exec(scripts.hackScript, hosts[0], threads.hackThreads, target);
	await ns.exec(scripts.growScript, hosts[1], threads.growThreads, target);
	await ns.exec(scripts.weakScript, hosts[2], threads.weakThreads, target);
}

export async function main(ns)
{
	ns.disableLog("ALL");
	const targets = getRootServers(ns).filter(							// targets = world.filter:
		t => ns.hasRootAccess(t)										// has root
		&& ns.getServerRequiredHackingLevel(t) < ns.getHackingLevel()	// can hack
		&& ns.getServerMaxMoney(t) > 0									// has money
		&& !isBeingFarmed(ns, t)										// not already being farmed
	);
	targets.sort((a,b) => calcValue(ns, a) < calcValue(ns, b) ? 1 : -1);// sort targets by $/time/ram
	//ns.tprint(targets);
	for(const target of targets) await farm_target(ns, target);	// farm targets
}