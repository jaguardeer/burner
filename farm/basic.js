/** @param {NS} ns **/
import {serverInfo} from "/cache/augment/serverInfo.js"

export function autocomplete(data, args) { return data.servers }

export async function main(ns)
{
	const target = ns.args[0];
	const server = serverInfo.find(s => s.hostname == target);
	const min_sec = server.minDifficulty;
	const max_cash = server.moneyMax;
	while(true)
	{
		const sec = ns.getServerSecurityLevel(target);
		if(sec > min_sec * 1.05)
		{
			await ns.weaken(target);
		}else if(ns.getServerMoneyAvailable(target) > max_cash * 0.9){
			await ns.hack(target);
		}else{
			await ns.grow(target);
		}
	}
}