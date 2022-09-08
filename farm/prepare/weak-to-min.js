/** @param {NS} ns **/
import {weakUntilMaxMoney, weakUntilMinSecurity} from "lib/prepare.js"

/*
			THIS SCRIPT WEAKENS A SERVER TO MIN SECURITY
*/

export async function main(ns)
{
	ns.disableLog("sleep");
	const target = ns.args[0];
	await weakUntilMinSecurity(ns, target);
}