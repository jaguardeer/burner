/** @param {NS} ns **/

import {getRamServers, printTable} from "/lib/lib.js"

function findFarmedServers(ns)
{	
	const farmDir = "/farm/";
	let results = [];
	const servers = getRamServers(ns);
	for(const server of servers)
	{
		const procs = ns.ps(server);
		for(const proc of procs)
		{
			if(proc.filename.startsWith(farmDir))
			{
				results.push({host: server, procInfo: proc});
			}
		}
	}
	return results;
}

export async function main(ns)
{
	const farmedServers = findFarmedServers(ns, ns.args[0]);
	farmedServers.sort((a,b) => a.filename > b.filename ? 1 : -1);
	farmedServers.sort((a,b) => a.procInfo.args.join(",") > b.procInfo.args.join(",") ? 1 : -1);
	const results = farmedServers.map(p => [
		p.host,
		p.procInfo.pid,
		p.procInfo.filename,
		p.procInfo.threads,
		p.procInfo.args.join(",")
	]);
	printTable(ns, [["HOST", "PID", "SCRIPT", "THREADS", "ARGS"]].concat(results))
}