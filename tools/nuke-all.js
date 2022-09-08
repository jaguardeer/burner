/** @param {NS} ns **/

import {tryNuke} from "/lib/nuke.js"
import {getAllServers} from "/lib/lib.js"

export async function main(ns)
{
	const targets = getAllServers(ns).filter(s => !ns.hasRootAccess(s));
	for(const target of targets)
	{
		if(tryNuke(ns, target)) ns.tprint("nuked " + target);
	}
}