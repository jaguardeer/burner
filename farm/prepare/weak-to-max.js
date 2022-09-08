/** @param {NS} ns **/
import {weakUntilMaxMoney, weakUntilMinSecurity} from "lib/prepare.js"
/*
			THIS SCRIPT WEAKENS A SERVER UNTIL MAX MONEY
*/
export async function main(ns)
{
	ns.disableLog("sleep");
	const target = ns.args[0];
	await weakUntilMaxMoney(ns, target);
	await weakUntilMinSecurity(ns, target);
}