/** @param {NS} ns **/

import {cachePurchasedServers} from "/lib/cache.js";

export function rentServer(ns, size)
{

}

export async function main(ns)
{
	if(ns.getPurchasedServers().length >= ns.getPurchasedServerLimit())
	{
		ns.tprint(`already rented max servers: ${ns.getPurchasedServerLimit()}`)
		return;
	}
	let max_size = 0;
	if(ns.args.length == 0 || ns.args[0] == "-")
	{
		max_size = ns.getPurchasedServerMaxRam();
		const money = ns.getServerMoneyAvailable("home");
		let cost = ns.getPurchasedServerCost(max_size);

		while(cost > money && max_size >= 1)
		{
			max_size /= 2;
			cost = ns.getPurchasedServerCost(max_size);
		}
	}
	else max_size = ns.args[0];
	const size = 2**Math.floor(Math.log2(max_size));

	const cost = ns.getPurchasedServerCost(size);
	
	const name = "node" + ns.getPurchasedServers().length;

	const message = size + " GB server costs " + ns.nFormat(cost,"0.0a") + ". Purchase?";
	const buyServer = (ns.args.length > 0 && ns.args[0] == "-") ? true : await ns.prompt(message);

	if(buyServer)
	{
		const result = ns.purchaseServer(name, size);
		await ns.scp("/cache/augment/serverInfo.js", result);
		await cachePurchasedServers(ns);
		ns.tprint("rented " + result + " with " + size + " GB");
	}
}