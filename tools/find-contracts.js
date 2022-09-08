/** @param {NS} ns **/
import {getAllServers} from "/lib/lib.js"

export async function main(ns)
{
	ns.disableLog("ALL");
	const world = getAllServers(ns);
	for(const h of world)
	{
		const contracts = ns.ls(h).filter(fn => fn.endsWith(".cct"));
		if(contracts.length > 0)
		{
			ns.tprint(h + " : " + contracts);
		}
	}
}