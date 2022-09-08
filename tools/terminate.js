/** @param {NS} ns **/

export function autocomplete(data,args) {return [...data.servers,"all"];}

import {getRootServers} from "/lib/lib.js"

export async function main(ns)
{
	let hosts = ns.args;
	if(ns.args[0] == "all")
	{
		hosts = getRootServers(ns).filter(h => h != "home");
	}
	for(const h of hosts) ns.killall(h);
}