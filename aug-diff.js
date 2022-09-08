/** @param {NS} ns **/
export function autocomplete() {return factions;}

import {printTable} from "/lib/lib.js"
import {factions} from "/lib/factions.js"

function isExclusive(aug, table)
{
	return table.filter(e => e.augs.includes(aug)).length == 1;
}

export async function main(ns)
{
	const facs = ns.args;

	let table = [];
	for(const fac of facs)
	{
		table.push({
			name: fac,
			augs: ns.getAugmentationsFromFaction(fac)
		});
	}

	let output = [];
	for(const e of table)
	{
		const exclusives = e.augs.filter(a => isExclusive(a, table));
		const repCost = e.augs.map(a => ns.getAugmentationRepReq(a));
		ns.tprint(repCost);
		ns.tprint(e.augs);
		output.push({
			name: e.name,
			exclusives: exclusives,
			maxRep: ns.nFormat(Math.max.apply(null, exclusives.map(a => ns.getAugmentationRepReq(a))),"0a")
		});
	}
	printTable(ns, [["FACTION", "EXCLUSIVES"]].concat(output.map(e => [e.name, e.exclusives.join(",")])));
	printTable(ns, [["FACTION", "REP NEEDED"]].concat(output.map(e => [e.name, e.maxRep])));
	//ns.tprint(output);
}