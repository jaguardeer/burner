export function autocomplete(data,args) {return [...data.servers];}

import {printTable} from "/lib/lib.js"

/** @param {NS} ns **/
export async function main(ns)
{
	if(ns.args.length != 1) ns.tprint("Usage: info server");
	else
	{
		const hostname = ns.args[0];
		const server = ns.getServer(hostname);
		const keys = ["cpuCores", "hasAdminRights",	"hostname", "maxRam", "ramUsed", "backdoorInstalled",
			"baseDifficulty", "hackDifficulty", "minDifficulty", "moneyAvailable", "moneyMax",
			"numOpenPortsRequired", "requiredHackingSkill", "serverGrowth"];
		const table = keys.map(k => [k, server[k]]);
		printTable(ns, table);
		//printTable(ns, Object.keys(obj).map(key => [key, server[key]]));
		//ns.tprint(Object.keys(server).join("\n"));
	}
}