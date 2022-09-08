/** @param {NS} ns **/

import {printTable, getRootServers} from "/lib/lib.js"

export async function main(ns)
{
	const servers = getRootServers(ns);
	//ns.tprint(servers);
	let rams = [];
	for(const s of servers)
	{
		let ram_max = ns.getServerMaxRam(s);
		let ram_cur = ns.nFormat(ram_max - ns.getServerUsedRam(s),"0.00");
		rams.push([s, ram_max, ram_cur]);
	}
	rams.sort((a,b) => Number(a[2]) > Number(b[2]) ? 1 : -1);
	rams.unshift(["SERVER", "MAX", "FREE"]);
	printTable(ns, rams);
}