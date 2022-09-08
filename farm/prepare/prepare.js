/** @param {NS} ns **/
export function autocomplete(data){return data.servers;}

import {calcWeakThreads, calcGrowThreads, waitUntilMinSecurity} from "/lib/prepare.js"
import {maxThreadsDistributed, distribute} from "/lib/alloc.js"


// weak to min
// grow+weak to max/min
async function prepareServer(ns, target)//, farmScript, ...farmArgs)
{
	while(true)
	{
	// clear security
		const weakToMinScript = "/farm/prepare/weak-to-min.js";
		const weakThreads = calcWeakThreads(ns, target);
		const maxWeakThreads = maxThreadsDistributed(ns, weakToMinScript);
		//ns.tprint("threads to weak " + target + " : " + weakThreads);
		if(weakThreads == 0) break;
		const pids = await distribute(ns, weakToMinScript, Math.min(weakThreads, maxWeakThreads), target);
		if(pids == null)
		{
			ns.print("waiting to launch weakThreads");
			await ns.sleep(1000);
		}
		else break;
		//ns.tprint(weakThreads + " weak threads needed");
	}
	ns.print("weakThreads launched. waiting for min security");
	await waitUntilMinSecurity(ns, target);
	{
		ns.print("launching grow+weak threads");
	// start weak / grow threads
	// only works if sizeof(growToMax) == sizeof(weakToMax)
		const growToMaxScript = "/farm/prepare/grow-to-max.js";
		const weakToMaxScript = "/farm/prepare/weak-to-max.js";
		const maxThreads = maxThreadsDistributed(ns, growToMaxScript);
		const maxGrowThreads = maxThreads / 13.5 * 12.5;
		const growNeeded = calcGrowThreads(ns, target);
		const growThreads = Math.floor(Math.min(maxGrowThreads, growNeeded));
		const weakThreads = Math.ceil(growThreads / 12.5);
		//ns.tprint(growThreads);
		//ns.tprint(weakThreads);
		//ns.tprint("threads to grow " + target + " : " + growThreads);
		//ns.tprint("threads to weak " + target + " : " + weakThreads);
		await distribute(ns, growToMaxScript, growThreads, target);
		await distribute(ns, weakToMaxScript, weakThreads, target);
	}
	//ns.print("launching farm script");
	//ns.spawn(farmScript, 1, ...farmArgs);
}

export async function main(ns)
{
	if(ns.args.length < 1)
	{
		ns.tprint("ERROR: must provide target");
		return;
	}
	ns.disableLog("ALL");
	const target = ns.args[0];
	//const farmScript = ns.args[1];
	//const farmArgs = ns.args.slice(2);
	await prepareServer(ns, target);//, farmScript, ...farmArgs);
}