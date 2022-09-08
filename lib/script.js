/** @param {NS} ns **/
import {getRootServers} from "/lib/lib.js"

function prefixMatch(string, prefix)
{
	return string.startsWith(prefix);
}

function exactMatch(stringA, stringB)
{
	return stringA == stringB;
}


// findScript
// finds all copies of a script running across all servers
export function findScript(ns, filename, args = [])
{	
	let results = [];
	const servers = getRootServers(ns);
	const matchFunc = filename.endsWith("*") ? prefixMatch : exactMatch;
	const matchString = filename.endsWith("*") ? filename.slice(0, -1) : filename;
	for(const server of servers)
	{
		const procs = ns.ps(server);
		for(const proc of procs)
		{
			if(matchFunc(proc.filename, matchString))
			{
				let matches = true;
				for(let i = 0 ; i < args.length ; i++) if(args[i] != proc.args[i]) matches = false;
				if(matches) results.push({host: server, procInfo: proc});
			}
		}
	}
	return results;
}

export async function main(ns)
{

}