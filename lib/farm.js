/** @param {NS} ns **/

import {getAllServers} from "/lib/lib.js"

const farmDir = "/farm/";


export function maxHackThreads(ns, target)
{
	const player = ns.getPlayer();
	const server = ns.getServer(target);
	server.moneyAvailable = server.moneyMax;
	const singleHack = ns.formulas.hacking.hackPercent(server, player);
	const hackThreads = Math.ceil(1 / singleHack);
	return hackThreads;
}

export function maxGrowThreads(ns, target, cores = 1)
{
	const player = ns.getPlayer();
	const server = ns.getServer(target);
	server.moneyAvailable = 1000;
	
	// TODO: implement as binary search?
	for(let threads = 0 ; threads < 10e3 ; threads++)
	{
		let growth = ns.formulas.hacking.growPercent(server, threads, player, cores);
		let money = threads * growth;
		if(money >= server.moneyMax) return threads;
	}
	return Infinity;
}

function needsPreparation(ns, target)
{
	const server = ns.getServer(target);
	const needsMoney = server.moneyAvailable < server.moneyMax;
	const needsWeaken = server.hackDifficulty > server.minDifficulty;
	return needsMoney || needsWeaken;
}

export function calcWeakThreads(ns, target, cores = 1)
{
	const weakEffect = ns.weakenAnalyze(1, cores);
	const server = ns.getServer(target);
	const securityDelta = server.hackDifficulty - server.minDifficulty;
	return Math.ceil(securityDelta / weakEffect);
}

function calcGrowThreads(ns, target, cores = 1)
{
	const player = ns.getPlayer();
	const server = ns.getServer(target);
	const growFactor = server.moneyMax / server.moneyAvailable;
	if(growFactor == Infinity) return Infinity;

	const base = ns.formulas.hacking.growPercent(server, 1, player, cores);
	if(base <= 1) return Infinity;
	return Math.log(growFactor) / Math.log(base);
}

async function prepareTarget(ns, target)
{
	const singleWeak = "/farm/single/weak.js"
	const singleGrow = "/farm/single/weak.js"

	const weakThreads = calcWeakThreads(ns, target);
	const growThreads = calcGrowThreads(ns, target);
}

export function isBeingFarmed(ns, target)
{
	const hosts = getAllServers(ns);
	for(const host of hosts)
	{
		const procs = ns.ps(host);
		//ns.tprint(host + " : " + procs);
		for(const proc of procs)
		{
			if(proc.filename.startsWith(farmDir))
			{
				if(proc.args.length > 0 && proc.args[0] == target) return true;
			}
		}
	}
	return false;
}


export async function main(ns)
{

}