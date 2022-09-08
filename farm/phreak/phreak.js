/** @param {NS} ns **/

//import {getAllServers} from "/lib/lib.js"

import {maxHackThreads, maxGrowThreads} from "/lib/farm.js"

function calcMaxThreads(ns, target)
{	
	// max threads
	const h = maxHackThreads(ns, target);
	const cores = ns.getServer("home").cpuCores;
	const g = maxGrowThreads(ns, target, cores);
	return {
		hackThreads: h,
		growThreads: g,
		weakThreads: Math.ceil(h / 25 + g / 12.5),
	};
}


// ASSUME INITIAL STATE: MAX MONEY, MIN SECURITY
async function phreak(ns, target, id, spacing)
{
	// THREAD CALCULATIONS
	const threads = calcMaxThreads(ns, target);
	const hThreads = threads.hackThreads;
	const gThreads = threads.growThreads;
	const weakDelta = 0.05;
	const w1Threads = threads.weakThreads;
	const w2Threads = threads.weakThreads;


	// TIME CALCULATIONS
	const wTime = ns.getWeakenTime(target);
	const gTime = ns.getGrowTime(target);
	const hTime = ns.getHackTime(target);

	const w1Landing = wTime;
	const gLanding = w1Landing + spacing;
	const w2Landing = gLanding + spacing;
	const hLanding = w2Landing + spacing;

	const w1Launch = 0;
	const gLaunch = gLanding - gTime;
	const w2Launch = w2Landing - wTime;
	const hLaunch = hLanding - hTime;


	// LAUNCH THREADS
	const hackScript = "/farm/single/hack.js";
	const growScript = "/farm/single/grow.js";
	const weakScript = "/farm/single/weak.js";

	const w1 = {script: weakScript, threads: w1Threads, time: w1Launch};
	const w2 = {script: weakScript, threads: w2Threads, time: w2Launch};
	const g = {script: growScript, threads: gThreads, time: gLaunch};
	const h = {script: hackScript, threads: hThreads, time: hLaunch};

	let scriptArray = [w1, w2, g, h];
	scriptArray.sort((a, b) => a.time < b.time ? -1 : 1);
	//for(const s of scriptArray) ns.tprint(s);
	let now = 0;
	for(let i = 0 ; i < scriptArray.length ; i++)
	{
		const launchTime = scriptArray[i].time;
		if(now < launchTime)
		{
			const wait = launchTime - now;
			await ns.sleep(wait);
			now += wait;
		}
		ns.run(scriptArray[i].script, scriptArray[i].threads, target, i, id);
	}
}



export async function main(ns)
{
	const target = ns.args[0];
	const spacing = ns.args[1];
	const id = ns.args[2];
	await phreak(ns, target, id, spacing);
	/*
	const target = 9000;
	const player = ns.getPlayer();
	const exp = ns.formulas.skills.calculateExp(9000, player.hacking_mult);
	ns.tprint("needed for " + target + " : " + ns.nFormat(exp, "0.0a"));

	ns.tprint("current exp: " + ns.nFormat(player.hacking_exp, "0.0a"));
	*/
	/*
	const target = "ecorp";
	const threads = 1000;
	const cores = 4;
	const player = ns.getPlayer();
	let server = ns.getServer(target);
	const amount = ns.formulas.hacking.growPercent(server, threads, player, cores);
	ns.tprint(amount);
	*/
}