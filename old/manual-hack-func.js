/** @param {NS} ns **/

export async function main(ns)
{
	await ns.installBackdoor();
	while(true) await ns.share();
}