/** @param {NS} ns **/
import {serverInfo} from "/cache/augment/serverInfo.js"

export function serverIsReady(ns, target)
{
	return isMaxMoney(target) && isMinSecurity(target);
}

export function isMaxMoney(ns, target)
{
	const info = serverInfo.find(s => s.hostname == target);
	return info.moneyMax <= ns.getServerMoneyAvailable(target);
}

export function isMinSecurity(ns, target)
{
	const info = serverInfo.find(s => s.hostname == target);
	//ns.tprint(target);
	//ns.tprint(info);
	return info.minDifficulty >= ns.getServerSecurityLevel(target);
}

export async function growUntilMaxMoney(ns, target)
{
	while(!isMaxMoney(ns, target))
	{
		while(!isMinSecurity(ns, target)) await ns.sleep(500);
		if(!isMaxMoney(ns, target)) await ns.grow(target);
	}
}

// will run forever unless another script calls grow()
export async function weakUntilMaxMoney(ns, target)
{
	while(!isMaxMoney(ns, target))
	{
		await ns.weaken(target);
	}
}

export async function weakUntilMinSecurity(ns, target)
{
	while(!isMinSecurity(ns, target))
	{
		await ns.weaken(target);
	}
}

export function calcWeakThreads(ns, target, host = null)
{
	const info = serverInfo.find(s => s.hostname == target)
	const minSec = info.minDifficulty;
	const curSec = ns.getServerSecurityLevel(target);
	const weakDelta = 0.05; // todo: cores

	return Math.max(0, Math.ceil((curSec - minSec) / weakDelta));
}

export function calcGrowThreads(ns, target, host = null)
{
	const info = serverInfo.find(s => s.hostname == target)
	const maxMoney = info.moneyMax;
	if(maxMoney == 0) return 0;
	let curMoney = ns.getServerMoneyAvailable(target);
	if(curMoney < 1) curMoney = 1;
	return ns.growthAnalyze(target, maxMoney / curMoney);
}


export async function waitUntilMinSecurity(ns, target)
{
	while(!isMinSecurity(ns, target)) await ns.sleep(250);
}

export async function main(ns)
{

}