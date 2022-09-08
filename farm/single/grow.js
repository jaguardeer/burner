/** @param {NS} ns **/
export const autocomplete = (data) => data.servers;

export async function main(ns)
{
	await ns.grow(ns.args[0]);
}