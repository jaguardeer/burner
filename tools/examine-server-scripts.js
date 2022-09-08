/** @param {NS} ns **/
export function autocomplete(data,args){return [...data.servers]};

import {printTable} from "/lib/lib.js";

export async function main(ns)
{
	const host = ns.args.length > 0 ? ns.args[0] : "home";
	const runningScripts = ns.ps(host);

	let table = [];
	for(const s of runningScripts)
	{
		table.push([s.pid, s.filename, s.threads, s.args]);
	}

	printTable(ns, Array(["PID", "FILENAME", "THREADS", "ARGS"]).concat(table));
}