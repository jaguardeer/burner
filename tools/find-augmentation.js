/** @param {NS} ns **/

/*
	THIS SCRIPT FINDS AUGMENTATIONS WITH DESIRED STAT
	AND LISTS WHO SELLS THEM
*/

import {factions} from "/lib/factions.js";
import {augmentations} from "/cache/augment/augmentations.js";
import {tableToString} from "/lib/lib.js";

const possibleStats = ["agility_exp_mult","agility_mult","bladeburner_analysis_mult","bladeburner_max_stamina_mult",
"bladeburner_stamina_gain_mult","bladeburner_success_chance_mult","charisma_exp_mult","charisma_mult","company_rep_mult",
"crime_money_mult","crime_success_mult","defense_exp_mult","defense_mult","dexterity_exp_mult","dexterity_mult",
"faction_rep_mult","hacking_chance_mult","hacking_exp_mult","hacking_grow_mult","hacking_money_mult","hacking_mult",
"hacking_speed_mult","hacknet_node_core_cost_mult","hacknet_node_level_cost_mult","hacknet_node_money_mult",
"hacknet_node_purchase_cost_mult","hacknet_node_ram_cost_mult","strength_exp_mult","strength_mult","work_money_mult"];
export function autocomplete(data,args){return possibleStats};


export async function main(ns)
{
	const key = parseArgs(ns);
	if(key == null) return;
	// GENERATE TABLE
	const matches = augmentations.filter(a => a.stats[key] != null && !ns.getOwnedAugmentations().includes(a.name));
	matches.sort((a,b) => a.stats[key] > b.stats[key] ? 1 : -1);
	let table = [];
	for(const m of matches)
		table.push([
		m.name,
		m.stats[key],
		ns.nFormat(ns.getAugmentationPrice(m.name),"0.0a"),
		m.soldBy
	]);
	// OUTPUT
	const preamble = "showing augmentations with " + key + "\n";
	const tableHeader = [["NAME","AMOUNT","PRICE","SOLD BY"]];
	const tableString = tableToString(Array().concat(tableHeader, table));
	ns.tprint(preamble + tableString)
}

function parseArgs(ns)
{
	// PARSE ARGS
	if(ns.args.length == 0)
	{
		const name = ns.getScriptName();
		ns.tprint("usage: " + name + " stats...\n");
		ns.tprint("do " + name + " -l to list possible stats values");
		return null;

	}
	else if(ns.args[0] == "-l")
	{
		ns.tprint("stats:\n" + possibleStats.join("\n"));
		return null;
	}
	else if(ns.args.length > 1)
	{
		ns.tprint("TODO: ALLOW SEARCHING MULTIPLE STATS");
		return null;
	}
	else return ns.args;
}