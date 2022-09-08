/** @param {NS} ns **/

import {maxHackThreads, maxGrowThreads} from "/lib/farm.js"
import {isBeingFarmed as libFarmed} from "/lib/farm.js"

// CONSTANTS
// TODO: LIB SHOULD BE ABLE TO PROVIDE SCRIPTS DYNAMICALLY
export const scripts = {
	weakScript: "/farm/smart/smart-weak-cheap.js",
	hackScript: "/farm/smart/smart-hack-cheap.js",
	growScript: "/farm/smart/smart-grow-cheap.js"
}


export function isBeingFarmed(ns, target)
{
	return libFarmed(ns, target);
}

//export function prepareServer

export function calcValue(ns, target)
{
	const player = ns.getPlayer();
	const server = ns.getServer(target);
	const time = ns.formulas.hacking.weakenTime({...server, hackDifficulty: server.minDifficulty}, player);
	const ram = Object.values(calcRam(ns, calcThreads(ns, target))).reduce((p, c) => p += c, 0);

	return server.moneyMax / time / ram;
}


function myGrowthAnalyze(ns, growFactor, serverObj, playerObj, cores)
{
	const base = ns.formulas.hacking.growPercent(serverObj, 1, playerObj, cores);
	if(base <= 1) return Infinity;
	return Math.log(growFactor) / Math.log(base);
}

export function calcThreads(ns, target, hostCores = 1)
{	
	// security deltas
	const weak_sec = ns.weakenAnalyze(1, hostCores);
	const hack_sec = 0.002;
	const grow_sec = 0.004;
	// assume server is fully prepared
	let playerObj = ns.getPlayer();
	let serverObj = ns.getServer(target);
	serverObj.moneyAvailable = serverObj.moneyMax;
	serverObj.hackDifficulty = serverObj.minDifficulty;
	// hack
	const hack_target = 0.90;
	const hack_amount = ns.formulas.hacking.hackPercent(serverObj, playerObj);
	//ns.tprint(hack_amount);
	const hack_threads = Math.floor(hack_target / hack_amount);
	//ns.tprint(hack_threads);
	// calc hack effects
	const hack_actual = hack_amount * hack_threads;
	serverObj.moneyAvailable *= 1 - hack_actual;
	serverObj.hackDifficulty += hack_threads * hack_sec;
	// calc grow threads
	const grow_threads = Math.ceil(myGrowthAnalyze(ns, 1 / (1 - hack_actual), serverObj, playerObj, hostCores));
	// weak
	const grow_delta = grow_threads * grow_sec;
	const hack_delta = hack_threads * hack_sec;
	const weak_threads = Math.ceil((grow_delta + hack_delta) / weak_sec);

	return {
		hackThreads: hack_threads,
		growThreads: grow_threads,
		weakThreads: weak_threads,
	};
}


export function calcRam(ns, threads)
{
	const growRam = threads.growThreads * ns.getScriptRam(scripts.growScript);
	const hackRam = threads.hackThreads * ns.getScriptRam(scripts.hackScript);
	const weakRam = threads.weakThreads * ns.getScriptRam(scripts.weakScript);

	return {
		hackRam: hackRam,
		growRam: growRam,
		weakRam: weakRam,
	}
}