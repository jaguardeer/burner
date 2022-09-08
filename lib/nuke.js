/** @param {NS} ns **/

import {getAllServers} from "/lib/lib.js";

export const exploitFiles = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];

export function getExploits(ns)
{
	const exploitTable = [
		{file: "BruteSSH.exe"	, func: ns.brutessh },
		{file: "FTPCrack.exe"	, func: ns.ftpcrack },
		{file: "relaySMTP.exe"	, func: ns.relaysmtp},
		{file: "HTTPWorm.exe"	, func: ns.httpworm },
		{file: "SQLInject.exe"	, func: ns.sqlinject}
	];
	return exploitTable.filter(e => ns.fileExists(e.file)).map(e => e.func);
}

export function tryNuke(ns, host)
{
	// RETURNS TRUE IF HOST IS OWNED AFTER RUNNING THIS FUNCTION
	if(ns.hasRootAccess(host)) return true;
	// COUNT OWNED EXPLOITS
	const exploits = getExploits(ns);
	// APPLY EXPLOITS & NUKE
	if(ns.getServerNumPortsRequired(host) <= exploits.length)
	{
		for(const exploit of exploits) exploit(host);
		ns.nuke(host);
		return true;
	}
	return false;
}

export function nukeAll(ns)
{
	const world = getAllServers(ns);
	//ns.tprint(world);
	const exploits = getExploits(ns);
	world.forEach(h => tryNuke(ns, h));
}