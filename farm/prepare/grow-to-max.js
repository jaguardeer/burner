/** @param {NS} ns **/
import {growUntilMaxMoney} from "/lib/prepare.js"
/*
			THIS SCRIPT GROWS A SERVER TO MAX MONEY
*/
export async function main(ns)
{
	ns.disableLog("sleep");
	const target = ns.args[0];
	await growUntilMaxMoney(ns, ns.args[0]);
}