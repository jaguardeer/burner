/** @param {NS} ns **/

function recurse(ns, prev, current, depth)
{
	let connections = ns.scan(current);
	for(let next of connections)
	{
		if(next != current && next != prev)
		{
			ns.tprint(Array(depth).join("-") + next);
			recurse(ns, current, next, depth+1);
		}
	}
}

export async function main(ns)
{
	let root = ns.getHostname();
	recurse(ns,"",root,1);
}