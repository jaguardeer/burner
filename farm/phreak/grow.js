/** @param {NS} ns **/
export const autocomplete = (data) => data.servers;

export async function main(ns)
{
	const target = ns.args[0];
	const minSec = ns.getServerMinSecurityLevel(target);
	while(ns.getServerSecurityLevel(target) > minSec) await ns.sleep(1);
	await ns.grow(ns.args[0]);
}