/** @param {NS} ns **/
import {world} from "/lib/world.js";

export async function main(ns)
{
	for(const h of world)
	{
		const contracts = ns.ls(h,ns.args);
		if(contracts.length > 0)
		{
			ns.tprint(h + " : " + contracts);
		}
	}
}