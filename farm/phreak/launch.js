/** @param {NS} ns **/


// this script is janky



function prepareServer(ns, target)
{
	const host = "home";
	const cores = ns.getServer(host).cpuCores;
	/*
	const growthAmount = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
	let growThreads = 500;
	if(growthAmount != Infinity) growThreads = Math.ceil(ns.growthAnalyze(target, growthAmount, cores))
	if(growThreads == Infinity) growThreads = 500;
	const growDelta = ns.growthAnalyzeSecurity(growThreads);
	const already = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
	const weakThreads = Math.ceil((already + growDelta) / 0.05 + 1000);
	*/
	// i have too much ram
	const growThreads = 2000;
	const weakThreads = 2000;

	if(growThreads > 0) ns.run("/farm/single/grow.js", growThreads, target);
	if(weakThreads > 0) ns.run("/farm/single/weak.js", weakThreads, target);
}


export async function main(ns)
{
	const target = ns.args[0];
	const individualSpacing = 100;
	const batchSpacing = individualSpacing * 5;
	let id = 0;
	prepareServer(ns, target);
	prepareServer(ns, target);
	await ns.sleep(ns.getWeakenTime(target) + 5000);
	while(true)
	{
		let now = 0;
		const firstLanding = ns.getWeakenTime(target);
		while(now < firstLanding - batchSpacing - individualSpacing)
		{
			ns.run("/farm/phreak/phreak.js", 1, target, individualSpacing, id);
			id++;
			await ns.sleep(batchSpacing);
			now += batchSpacing;
		}
		await ns.sleep(individualSpacing * 2);
	}
}