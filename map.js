/** @param {NS} ns **/

function recurse(ns, prev, current)
{
	let connections = ns.scan(root);
	for(let next of connections)
	{
		if(next != root && next != next)
		{
			ns.tprint(next);
			recurse(ns, current, next);
		}
	}
}

export async function main(ns)
{
	let root = ns.getHostname();
	recurse(ns,"",root);
}