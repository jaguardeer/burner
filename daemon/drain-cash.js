/** @param {NS} ns **/
export function autocomplete(data,args){return [...data.servers];}

import {serverInfo} from "/cache/augment/serverInfo.js"
import {getAllServers} from "/lib/lib.js"

function chooseTarget(ns, serverInfos)
{
	let bestTarget = null;
	let bestRate = 0;
	for(let server of serverInfos)
	{
		// update money & security to current values
		server.moneyAvailable = ns.getServerMoneyAvailable(server.hostname);
		server.hackDifficulty = ns.getServerSecurityLevel(server.hostname);
		const player = ns.getPlayer();
		const moneyStolen = server.moneyAvailable * ns.formulas.hacking.hackPercent(server, player);
		const time = ns.getHackTime(server.hostname);
		const moneyRate = moneyStolen / time;
		if(moneyRate > bestRate)
		{
			bestTarget = server.hostname;
			bestRate = moneyRate;
		}
	}
	return bestTarget;
}

export async function main(ns)
{
	// setup log
	ns.disableLog("ALL");
	ns.enableLog("hack");
	// build targetInfos array
	const targetInfos = (ns.args.length < 1 || ns.args[0] == "all") ? serverInfo.filter(server => ns.hasRootAccess(server.hostname) && server.moneyMax > 0) : ns.args;
	// begin draining servers
	while(true)
	{
		const target = chooseTarget(ns, targetInfos);
		if(target) await ns.hack(target);
		else await ns.sleep(1000);
	}
}