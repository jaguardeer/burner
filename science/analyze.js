/** @param {NS} ns **/
export function autocomplete(data){return data.servers}

import {maxThreadsDistributed} from "/lib/alloc.js"

function myGrowthAnalyze(base, factor)
{
	return Math.log(factor) / Math.log(base);
}

export async function main(ns)
{
	if(ns.args.length < 1)
	{
		ns.tprint("must provide a target");
		return;
	}
	const target = ns.args[0];
	const server = ns.getServer(target);
	const player = ns.getPlayer();
	server.hackDifficulty = server.minDifficulty;

	// calc grow threads to max
	const maxMoney = server.moneyMax;
	const curMoney = server.moneyAvailable;
	const base = ns.formulas.hacking.growPercent(server, 1, player);
	const factor = maxMoney / curMoney;
	const growThreads = myGrowthAnalyze(base, factor);
	ns.tprint(growThreads + " grows needed to max money on " + target);
	// calc max threads i can run
	const maxThreads = Math.floor(maxThreadsDistributed(ns, "/farm/prepare/grow-to-max.js") / 13.5 * 12.5)
	ns.tprint("Can currently run " + maxThreads + " grow threads.");
	// calc cycles
	const growCycles = Math.ceil(growThreads / maxThreads);
	ns.tprint("It will take " + growCycles + " grow cycles");
	// calc time
	const grow_ms = ns.formulas.hacking.weakenTime(server, player);
	ns.tprint("One grow cycle takes " + ns.tFormat(grow_ms));
	ns.tprint("It will take " + ns.tFormat(growCycles * grow_ms) + " to max money");

	const hackAmount = ns.formulas.hacking.hackPercent(server, player);
	ns.tprint("A hack will steal " + ns.nFormat(hackAmount, "0.00%"));
}