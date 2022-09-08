/** @param {NS} ns **/

import {world} from "/lib/world.js"
import {printTable} from "/lib/lib.js"

/*
	THIS SCRIPT TESTS XP GRINDING SCRIPTS
	IT RUNS A FEW THREADS OF A GRIND SCRIPT TARGETING EACH AVAILABLE SERVER
	AFTER 15 MINUTES IT COLLECTS DATA AND PRINTS RESULTS
*/

function setupLog(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
}

function error(ns, errorMsg)
{
	ns.toast(errorMsg, "error");
	ns.print(errorMsg, "error");
}

export async function main(ns)
{
	// INIT
	setupLog(ns);
	const targets = world.filter(s => ns.hasRootAccess(s) == true);
	const host = ns.args[0];
	const numThreads = 20;
	// START GRIND SCRIPTS
	let pids = [];
	for(const target of targets)
	{
		const script = "loop-weak.js";
		await ns.scp(script, host);
		const pid = ns.exec(script, host, numThreads, target);
		if(pid != 0) pids.push(
			{
				pid: pid,
				start: ns.getServerSecurityLevel(target),
				min: ns.getServerMinSecurityLevel(target)
			});
		else error(ns, "failed to start " + script + " for " + target + " on " + host);
	};
	// WAIT 15 MINUTES
	await ns.sleep(15 * 60 * 1000);
	// COLLECT DATA AND KILL SCRIPTS
	let results = [];
	for(const pid of pids)
	{
		const data = ns.getRunningScript(pid.pid);
		results.push([data.args[0], pid.min, pid.start, data.onlineExpGained]);
		ns.kill(pid.pid);
	}
	// PRINT DATA
	results.sort((a,b) => a[3] > b[3] ? 1 : -1);
	printTable(ns, Array(["NAME","SECURITY_MIN","SECURITY_START","EXP"]).concat(results));
}