/** @param {NS} ns **/

//import {alloc} from "/lib/alloc.js"

const scripts = {
	h: "/farm/single/hack.js",
	g: "/farm/single/grow.js",
	w: "/farm/single/weak.js",
}


export async function main(ns)
{
	const target = ns.args[0];
	const host = "home";
	const cores = ns.getServer(host).cpuCores;
	
	let server = ns.getServer(target);
	const securityDelta = ns.weakenAnalyze(1);
	// first weaken wave
	let time = ns.getWeakenTime(target);
	let security = server.hackDifficulty - server.minDifficulty;
	const weakThreads = Math.ceil(security / securityDelta);
	if(weakThreads > 0) ns.run(scripts.w, weakThreads, target);
	// let it finish
	await ns.sleep(time + 5000);
	// grow wave
	const curMoney = ns.getServerMoneyAvailable(target);
	const maxMoney = ns.getServerMaxMoney(target);
	const growThreads = Math.ceil(ns.growthAnalyze(target, maxMoney / curMoney, cores));
	const secondSecurity = ns.growthAnalyzeSecurity(growThreads);
	if(growThreads > 0) ns.run(scripts.g, growThreads, target);
	// give it a lil head start
	await ns.sleep(5000);
	// second weaken wave
	const secondWeak = Math.ceil(secondSecurity / securityDelta);
	if(secondWeak > 0) ns.run(scripts.w, secondWeak, target);
}