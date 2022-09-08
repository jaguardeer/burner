/** @param {NS} ns **/
export function autocomplete(data,args){return [...data.servers];}


import {calcValue, isBeingFarmed} from "/farm/smart/smart-lib.js"
import {getAllServers} from "/lib/lib.js"
import {alloc} from "/lib/alloc.js"

async function destroySecurity(ns, target, host)
{
	const script = "/farm/weak-single.js"
	const weakDelta = ns.weakenAnalyze(1);

	const security = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
	const threads = Math.ceil(security / weakDelta);
	//ns.tprint(target + " " + security + " " + threads);
	if(threads > 0)
	{
		const ram = ns.getScriptRam(script) * threads;
		const host = alloc(ns, ram);
		if(host == null) return;
		if(!ns.fileExists(script, host)) await ns.scp(script, host);
		ns.exec(script, host, threads, target);
	}
}

export async function prepareServers(ns)
{
	const targets = getAllServers(ns).filter(							// targets = world.filter:
		t => ns.hasRootAccess(t)										// has root
		&& ns.getServerRequiredHackingLevel(t) < ns.getHackingLevel()	// can hack
		&& ns.getServerMaxMoney(t) > 0									// has money
		&& !isBeingFarmed(ns, t)										// not already being farmed
	);
	targets.sort((a,b) => calcValue(ns, a) < calcValue(ns, b) ? 1 : -1);// sort targets by $/time/ram
	for(const target of targets)
	{
		await destroySecurity(ns, target);
	}
}


export async function main(ns)
{
	prepareServers(ns);
}