/** @param {NS} ns **/
export function autocomplete(data,args){return [...data.scripts];}

import {printTable} from "/lib/lib.js";
import {findScript} from "/lib/script.js"

// TODO: CONSOLIDATE MATCHES

export async function main(ns)
{
	const procs = findScript(ns, ns.args[0], ns.args.slice(1));
	const results = procs.map(p => [p.procInfo.pid, p.host, p.procInfo.threads, p.procInfo.args.join(",")]);
	printTable(ns, [["PID", "HOST", "THREADS", "ARGS"]].concat(results));
	const threads = procs.reduce((sum, proc) => sum += proc.procInfo.threads, 0);
	ns.tprint(threads + " total threads");
}