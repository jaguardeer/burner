/** @param {NS} ns **/
export async function main(ns)
{
	const player = ns.getPlayer();
	const curExp = player.hacking_exp;
	const targetLevel = ns.getServer("w0r1d_d43m0n").requiredHackingSkill;
	const targetExp = ns.formulas.skills.calculateExp(targetLevel, player.hacking_mult);
	ns.tprint("Current EXP: " + ns.nFormat(curExp, "0.00a"));
	ns.tprint("EXP for " + targetLevel + ": " + ns.nFormat(targetExp, "0.00a"));
	ns.tprint("Remaining: " + ns.nFormat(targetExp - targetExp, "0.00a"));
}