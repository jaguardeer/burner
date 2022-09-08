/** @param {NS} ns **/

import {getAllServers, printObjArray, objArrayToString} from "/lib/lib.js";

export async function main(ns)
{
	let data = [];
	const player = ns.getPlayer();
	for(const serverName of getAllServers(ns))
	{
		let server = ns.getServer(serverName);
		server.hackDifficulty = server.minDifficulty;
		const expGain = ns.formulas.hacking.hackExp(server, player);
		const time = ns.formulas.hacking.hackTime(server, player);
		const rate = expGain / time;
		data.push({name: serverName, rate: rate});
	}
	data.sort((a,b) => a.rate > b.rate ? -1 : 1);
	
	const niceData = data.map(d => ({host: d.name, rate: ns.nFormat(d.rate, "0.0e+0")}));
	printObjArray(ns, niceData.slice(0,2));
	//ns.tprint("\n" + objArrayToString(niceData.slice(0,10)));

	const bitnodeMult = ns.getBitNodeMultipliers().HackingLevelMultiplier;
	const playerMult = ns.getPlayer().hacking_mult;
	const hackingMult = bitnodeMult * playerMult;
	const world_daemon = ns.getServer("w0r1d_d43m0n");
	ns.tprint("world_daemon xp: " + ns.nFormat(ns.formulas.skills.calculateExp(world_daemon.requiredHackingSkill, hackingMult), "0.0a"));
	if(ns.args[0])
	{
		const goal = ns.args[0];
		ns.tprint(`${ns.args[0]} xp: ${ns.nFormat(ns.formulas.skills.calculateExp(goal, hackingMult), "0.0a")}`);
	}
	ns.tprint("current xp: " + ns.nFormat(ns.getPlayer().hacking_exp, "0.0a"));
}