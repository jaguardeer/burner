/** @param {NS} ns **/

function recurse(ns, depth, root)
{
	let connections = ns.scan(root);
	for(let host of connections)
	{
		if(host != root) tprint(host);
	}
}

export async function main(ns)
{
	let root = ns.getHostname();
	recurse(root);
}