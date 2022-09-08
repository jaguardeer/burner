/** @param {NS} ns **/

import {factions, autocomplete2} from "/lib/factions.js";
export var autocomplete = autocomplete2;

export async function main(ns)
{
	const factionList = ns.args.length > 0 ? [ns.args.join(" ")] : factions;
	for(const faction of factionList)
	{
		const factionAugs = ns.getAugmentationsFromFaction(faction);
		const myAugs = ns.getOwnedAugmentations(true);
		const list = factionAugs.filter(a => !myAugs.includes(a));
		if(list.length > 0)	ns.tprint(faction + "\n" + list.sort().join("\n"));
	}
}