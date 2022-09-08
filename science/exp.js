/** @param {NS} ns **/
export async function main(ns)
{
	const target = "n00dles";
	const playerBase = ns.getPlayer();
	let serverBase = ns.getServer(target);
	let exp = ns.formulas.hacking.hackExp(serverBase, playerBase);
	ns.tprint(target + " : " + exp);

	playerBase.hacking *= 20;
	exp = ns.formulas.hacking.hackExp(serverBase, playerBase);
	ns.tprint(target + " : " + exp);
}