/** @param {NS} ns **/

import {crimes} from "/lib/crimes.js"
import {printTable} from "/lib/lib.js"

export async function main(ns)
{
	
	let raw_table = [];
	for(const crime of crimes)
	{
		const stats = ns.getCrimeStats(crime);
		raw_table.push([stats.name, stats.money, stats.time / 60 / 1000]);
	}
	raw_table.sort((a,b) => Number(a[1]) > Number(b[1]) ? 1 : -1);

	const table = raw_table.map(e => [e[0], ns.nFormat(e[1], "0.0a"), ns.nFormat(e[2], "0.0a")]);

	printTable(ns, Array(["NAME", "MONEY", "TIME"]).concat(table));
}