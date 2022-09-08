/** @param {NS} ns **/

import {nukeAll} from "/lib/nuke.js"
import {serverInfo} from "/cache/augment/serverInfo.js"

export async function main(ns)
{
	ns.travelToCity("Volhaven");
	ns.universityCourse("zb institute of technology", "algorithms", false);
	ns.run("/tools/exec.js", 1, "home", "loop-weak.js", "0", "joesguns");
	while(ns.getHackingLevel() < 1000) await ns.sleep(50);
	//ns.run("/crimeChain/start.js", 1, "35", "homicide");
	ns.scriptKill("loop-weak.js", "home");
	await ns.sleep(200);
	ns.run("train-combats.js", 1, 1500);
	while(ns.getHackingLevel() < 3000 || ns.getServerMoneyAvailable("home") < 500000000 || !ns.fileExists("Formulas.exe"))
	{
		await ns.sleep(50);
		ns.run("buy-exploits.js");
		nukeAll(ns);
		ns.run("/farm/smart/smart-setup.js");
		await ns.share();
		ns.run("/tools/exec.js", 1, "all", "loop-weak.js", "0", "joesguns");
		await ns.share();
		ns.purchaseProgram("Formulas.exe");
	}
	// START BIGFARM
	let kills = ns.ps("home").filter(p => p.filename != "mastermind.js");
	kills.forEach(k => ns.kill(k.pid));
	nukeAll(ns);
	const bigFarms = serverInfo.sort((a,b) => a.moneyMax > b.moneyMax ? -1 : 1).slice(0,9);
	for(const f of bigFarms) ns.run("/farm/big-farm.js", 1, f.hostname);
	ns.run("train-combats.js", 1, 1500);
	// HARD GRIND EXP
	if(ns.formulas.skills.calculateExp(9000, ns.getPlayer().hacking_mult) < 2e12)
	{
		while(ns.getPurchasedServerLimit() > ns.getPurchasedServers().length)
		{
			while((ns.getServerMoneyAvailable("home") > 2e12) && (ns.getPurchasedServerLimit() > ns.getPurchasedServers().length))
			{
				ns.run("/tools/rent.js", 1, "-");
				await ns.sleep(50);
			}
			await ns.sleep(50);
			ns.run("/tools/exec.js", 1, "all", "loop-weak.js", "0", "joesguns");
			await ns.share();
		}
	}
}