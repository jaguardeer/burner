/** @param {NS} ns **/

import {serverInfo} from "/cache/augment/serverInfo.js"
import {getAllServers, printTable} from "/lib/lib.js"
import {calcRam, calcThreads, calcValue} from "/farm/smart/smart-lib.js"
import {isBeingFarmed} from "/lib/farm.js"


export async function main(ns)
{
	const player = ns.getPlayer();
	const servers = serverInfo.filter(server => server.moneyMax > 0);
	let candidates = [];
	for(const server of servers)
	{	
		const m = server.moneyMax;
		const t = ns.formulas.hacking.weakenTime({...server, hackDifficulty: server.minDifficulty}, player);
		const cost = Object.values(calcRam(ns, calcThreads(ns, server.hostname))).reduce((p, c) => p += c, 0);
		//const cost = calc_cost(ns, server, player);
		const value = calcValue(ns, server.hostname);

		const root = ns.hasRootAccess(server.hostname) ? "Y" : "N"
		//const ready = (server.minDifficulty == ns.getServerSecurityLevel(server.hostname)) ? "Y" : "N";
		const farmed = isBeingFarmed(ns, server.hostname) ? "Y" : "N";

		candidates.push({
			name: server.hostname,
			time: t / 1000,
			root: root,
			farmed: farmed,
			cash: m,
			cost: cost,
			value: value
		});
	}

	candidates.sort((a,b) => a.value < b.value ? 1 : -1);
	
	let table = candidates.map(c => [
		c.name,
		c.root,
		c.farmed,
		Math.floor(c.time / 60) + ":" + ns.nFormat(Math.floor(c.time % 60), "00"),
		ns.nFormat(c.cash,"0.00a"),
		ns.nFormat(c.cost,"0.00a"),
		ns.nFormat(c.value,"0.0e+0"),
		]);
		
	let num_rows = ns.args.length > 0 ? ns.args[0] : 10;
	if(num_rows == 0) num_rows = Infinity;
	printTable(ns, Array(["SERVER","ROOT","FARMED","TIME","CASH","COST","VALUE"]).concat(table.slice(0,num_rows)));
}