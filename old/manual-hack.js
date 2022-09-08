export function autocomplete(data, args) {return [...data.servers];}

import {goto} from "/lib/goto.js"


// CONSTANTS
const manualHackScript = "/lib/manual-hack-func.js";

async function waitForHackResult(ns, host)
{
	const waitExpr = "share: ";
	let waiting = true;
	while(waiting)
	{
		const logs = ns.getScriptLogs(manualHackScript, host);
		for(const line of logs)
		{
			if(line.indexOf(waitExpr) != -1)
			{
				waiting = false;
				return;
			}
		}
		await ns.share();
	}
}

function checkFailed(ns, host)
{
	const testExpr = "installBackdoor: Successfully";
	
	const logs = ns.getScriptLogs(manualHackScript, host);
	for(const line of logs)
	{
		//ns.tprint(line);
		if(line.startsWith(testExpr)) return false;
	}
	return true;
}

function startManualHack(ns, host)
{
	const pid = ns.exec(manualHackScript, host);
	return pid;
}

export async function main(ns)
{
	// INIT
	const root = "home";
	ns.connect(root);
	const target = ns.args[0];
	if(!ns.hasRootAccess(target))
	{
		ns.tprint("ERROR: you need root access to backdoor " + target);
		return;
	}
	// FIND PATH
	let path = [];
	recurseFindPath(ns,"",root,target,path);
	followPath(ns, path);
	// MANUALLY HACK UNTIL SUCCESS
	await ns.installBackdoor();
	ns.connect(root);
	/*
	let failed = true;
	while(failed == true)
	{
		// GOTO TARGET
		const host = "home"; // TODO - change this later?
		followPath(ns, path);
		// START HACK, TEST FAILURE
		const pid = startManualHack(ns, host);
		if(pid == 0)
		{
			ns.tprint("error: failed to start " + manualHackScript + " on " + host);
			return;
		}
		// MICROSLEEP, GO HOME, WAIT FOR RESULTS
		await ns.sleep(100);
		ns.connect(root);
		await waitForHackResult(ns, host);
		failed = checkFailed(ns, host);
		ns.kill(pid);
	}
	*/
	ns.connect(root);
}