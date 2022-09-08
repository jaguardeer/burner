/** @param {NS} ns **/

/*
 * Run this daemon with a lot of threads.
*/

import {getRootServers} from "/lib/lib.js";
import {isBeingFarmed} from "/lib/farm.js"

function chooseTarget(ns)
{
	const targets = getRootServers(ns).filter(target => !isBeingFarmed(ns, target));
	let bestTime = Infinity;
	let bestTarget = null;
	for(const t of targets)
	{
		if(ns.getServerSecurityLevel(t) > ns.getServerMinSecurityLevel(t))
		{
			const weakTime = ns.getWeakenTime(t)
			if(bestTime > weakTime)
			{
				bestTime = weakTime;
				bestTarget = t;
			}
		}
	}
	return bestTarget;
}

export async function main(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("scan");
	while(true)
	{
		const target = chooseTarget(ns);
		if(target == null) await ns.weaken("n00dles");//ns.share();
		else await ns.weaken(target);
	}
}