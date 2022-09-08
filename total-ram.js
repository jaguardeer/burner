/** @param {NS} ns **/

import {world} from "/lib/world.js"


export async function main(ns)
{
	const rootServers = world.filter(s => ns.hasRootAccess(s));
	const rentServers = ns.getPurchasedServers();
	const home = ["home"];

	const servers = Array().concat(rootServers, rentServers, home);

	const totalRam = servers.reduce((p,c) => p += ns.getServerMaxRam(c), 0);
	ns.tprint(totalRam);
}