/** @param {NS} ns **/
export function autocomplete(data,args) {return [...data.servers,...data.scripts];}

import {getRootServers, errorPrint} from "/lib/lib.js"
import {calcMaxThreads, execSafe} from "/lib/alloc.js"

function max_threads(ns, hosts, script)
{
	let threads = Array(hosts.length);
	for(let i = 0 ; i < hosts.length ; i++)	threads[i] = calcMaxThreads(ns, hosts[i], script);
	return threads;
}

export async function main(ns)
{
	if(ns.args.length < 3)
	{
		ns.tprint("usage: exec.js host script threads ...args");
		return;
	}
	let hosts = [ns.args[0]];
	const script = ns.args[1];
	let threads = [ns.args[2]];
	const args = ns.args.slice(3);

	if(!ns.fileExists(script))
	{
		ns.tprint("file not found: " + script);
		return;
	}

	if(hosts[0] == "all")
	{
		hosts = getRootServers(ns);
	}

	if(threads[0] == -1)
	{
		for(const h of hosts) await ns.killall(h);
		threads = max_threads(ns, hosts, script);
	}
	
	if(threads[0] == 0) threads = max_threads(ns, hosts, script);
	
	for(let i = 0; i < hosts.length; i++)
	{
		if(threads[i] > 0)
		{
			const pid = await execSafe(ns, hosts[i], script, threads[i], ...args);
			if(pid == 0 || pid == null) errorPrint(ns, "can't exec " + script + " on " + hosts[i] + " with " + threads[i] + " threads");
		}
	}
}