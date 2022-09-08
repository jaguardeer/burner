/** @param {NS} ns **/

export function autocomplete(data,args) {return [...data.servers,...data.scripts];}
import {getRootServers} from "/lib/lib.js"


export async function main(ns)
{
	const servers = getRootServers(ns);

	const script = ns.args[0];
	const args = ns.args.slice(1);
	
	for(const host of servers)
	{
		ns.kill(script, host, ...args);
	}
}