/** @param {NS} ns **/

/** @param {NS} ns **/

import {world} from "/lib/world.js"

function nukeAll(ns)
{
	for(const host of world) tryNuke(ns, host);
}

function tryNuke(ns, host)
{
	// RETURNS TRUE IF HOST IS OWNED AFTER RUNNING THIS FUNCTION
	if(ns.hasRootAccess(host)) return true;
	// COUNT OWNED EXPLOITS
	const possible_exploits = [
		{file: "BruteSSH.exe", func: ns.brutessh},
		{file: "FTPCrack.exe", func: ns.ftpcrack},
		{file: "relaySMTP.exe", func: ns.relaysmtp},
		{file: "HTTPWorm.exe", func: ns.httpworm},
		{file: "SQLInject.exe", func: ns.sqlinject}
	];
	let exploits = [];
	for(const e of possible_exploits)
	{
		if(ns.fileExists(e.file, "home")) exploits.push(e.func);
	}
	// APPLY EXPLOITS & NUKE
	if(ns.getServerNumPortsRequired(host) <= exploits.length)
	{
		for(const exploit of exploits) exploit(host);
		ns.nuke(host);
		return true;
	}
	return false;
}

function init(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("share");
	nukeAll(ns);
}

function calcMaxThreads(ns, host, script)
{
	const cost = ns.getScriptRam(script);
	const ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	const threads = Math.floor(ram / cost);
	return threads;
}

function getOwnedServers(ns)
{
	let ownedServers = world.filter(s => ns.hasRootAccess(s));
	let purchased = ns.getPurchasedServers();
	if(purchased.length > 0) ownedServers = ownedServers.concat(purchased);
	ownedServers.push("home");
	return ownedServers;
}

async function waitForCash(ns, amount)
{
	while(amount > ns.getServerMoneyAvailable("home")) await ns.share();
}

export async function main(ns)
{
	// INIT
	init(ns);
	// START HACK TRAINING SCRIPTS
	ns.tprint("START HACK TRAINING SCRIPTS");
	const trainingTarget = "n00dles"
	const trainingScript = "loop-weak.js";
	for(const host of getOwnedServers(ns))
	{
		const threads = calcMaxThreads(ns, host, trainingScript);
		if(threads > 0)
		{
			if(host != "home") await ns.scp(trainingScript, host);
			ns.exec(trainingScript, host, threads, trainingTarget);
		}
	}
	// WAIT UNTIL 1300 HACK LEVEL
	ns.tprint("WAIT UNTIL 1300 HACK LEVEL");
	while(ns.getHackingLevel() < 1300)
	{
		await ns.share();
	}
	// FREE SOME RAM
	ns.tprint("FREE SOME RAM");
	await ns.kill(trainingScript, "home", trainingTarget);
	// INITIAL FARM
	ns.tprint("INITIAL FARM");
	let pid = ns.run("farm-all.js", 1, "home");
	if(pid == 0)
	{
		ns.tprint("UNABLE TO INITIAL FARM!!");
		return;
	}
	// GET TOR ROUTER AND NUKE REST OF SERVERS
	ns.tprint("WAITING FOR 280m. BUY TOR ROUTER IN THE MEANTIME");
	ns.tprint("RUN THIS CODE AT 280m\nbuy HTTPWorm.exe;buy SQLInject.exe");
	await waitForCash(ns, 280 * 1000000);
	while(!ns.fileExists("HTTPWorm.exe","home")) await ns.share();
	while(!ns.fileExists("SQLInject.exe","home")) await ns.share();
	// FARM EVERYTHING ELSE
	ns.tprint("FARM EVERYTHING ELSE");
	nukeAll(ns);
	await ns.share();
	pid = ns.run("farm-all.js", 1, "home");
	if(pid == 0)
	{
		ns.tprint("UNABLE TO FARM EVERYTHING ELSE!!");
		return;
	}
	// GET GIGASERVERS AND START FARMING XP
	ns.tprint("GET GIGASERVERS AND START FARMING XP");
	while(ns.getPurchasedServers().length < ns.getPurchasedServerLimit())
	{
		const gigaRam = ns.getPurchasedServerMaxRam();
		const gigaCost = ns.getPurchasedServerCost(gigaRam);
		while(gigaCost > ns.getServerMoneyAvailable("home")) await ns.share();
		const gigaServer = ns.purchaseServer("node", gigaRam);
		if(gigaServer == "")
		{
			ns.tprint("GIGASERVER ERROR!!!");
			return;
		}
		const threads = calcMaxThreads(ns, gigaServer, trainingScript);
		await ns.scp(trainingScript, gigaServer);
		ns.exec(trainingScript, gigaServer, threads, trainingTarget);
	}
	// ALL GIGASERVERS ARE BOUGHT. RESTART FARM CUZ HACK LEVEL IS MUCH HIGHER NOW
	ns.tprint("ALL GIGASERVERS ARE BOUGHT. RESTART FARM CUZ HACK LEVEL IS MUCH HIGHER NOW");
	await ns.scriptKill("smart_hack.js");
	await ns.scriptKill("smart_grow.js");
	await ns.scriptKill("loop_weak.js");
	ns.run("farm-all.js", 1, "home");
	// COAST TO 100 BIL, and 2500 HACKING, JOIN DAEDALUS, DONATE & WIN
	ns.tprint("COAST TO 100 BIL, and 2500 HACKING, JOIN DAEDALUS, DONATE & WIN");
	while(100 * 1000000000 > ns.getServerMoneyAvailable("home")) await ns.share();
	while(2500 > ns.getHackingLevel()) await ns.share();
	ns.tprint("JOIN DAEDAELUS NOW");
}