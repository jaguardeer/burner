/** @param {NS} ns **/

function recurse(ns, root)
{
	let connections = ns.scan(root);
	for(let host of connections)
	{
		if(host != root) ns.tprint(host);
		recurse(ns,root);
	}
}

export async function main(ns)
{
	let root = ns.getHostname();
	recurse(ns,root);
}