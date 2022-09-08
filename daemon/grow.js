/** @param {NS} ns **/

/*
 * Run this daemon with a lot of threads.
*/

import {getRootServers} from "/lib/lib.js";

function chooseTarget(ns)
{
	const targets = getRootServers(ns).filter(t => 
		ns.getServerSecurityLevel(t) <= ns.getServerMinSecurityLevel(t) &&
		ns.getServerMoneyAvailable(t) < ns.getServerMaxMoney(t)
	);
	let bestTime = Infinity;
	let bestTarget = null;
	for(const t of targets)
	{
		const time = ns.getGrowTime(t)
		if(bestTime > time)
		{
			bestTime = time;
			bestTarget = t;
		}
	}
	return bestTarget;
}

export async function main(ns)
{
	while(true)
	{
		const target = chooseTarget(ns);
		if(target == null) await ns.sleep(1000);
		else await ns.grow(target);
	}
}