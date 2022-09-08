/** @param {NS} ns **/

let world = [];

function recurse(ns, prev, current)
{
	const connections = ns.scan(current);
	world.push('"' + current + '"');
	for(const next of connections)
	{
		if(next != current && next != prev)
		{
			recurse(ns, current, next);
		}
	}
}

export async function main(ns)
{
	//starting from "home" recurse down, filling world[], ignoring purchased servers
	const home = "home";
	const ignore = ns.getPurchasedServers() + "darkweb";
	const connections = ns.scan("home").filter(name => !ignore.includes(name));

	for(const h of connections)	recurse(ns,home,h);	

	//sort & write
	world.sort();
	ns.write("/lib/world.js","export const world = [" + world.join(",") + "];","w");
}