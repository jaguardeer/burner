/** @param {NS} ns **/
import {serverInfo} from "/cache/augment/serverInfo.js"

export function autocomplete(data, args) { return data.servers }

export async function main(ns)
{
	const target = ns.args[0];
	const thisThreads = ns.args[1];
	if(ns.args.length < 2)
	{
		ns.tprint("ERROR: WRONG ARGS");
		return;
	}
	const server = serverInfo.find(s => s.hostname == target);
	const minSec = server.minDifficulty;
	const maxMoney = server.moneyMax;
	const hackLimit = 0.9;
	while(true)
	{
		const curSec = ns.getServerSecurityLevel(target);
		if(curSec > minSec)
		{
			await ns.weaken(target);
		}else if(ns.getServerMoneyAvailable(target) < maxMoney){
			await ns.grow(target);
		}else{
			const maxThreads = ns.hackAnalyzeThreads(target, maxMoney * hackLimit);
			await ns.hack(target, {threads: Math.min(thisThreads, maxThreads)});
		}
	}
}