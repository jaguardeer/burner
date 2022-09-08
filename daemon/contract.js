/** @param {NS} ns **/

import {doContracts} from "/do-contract.js"

export async function main(ns)
{
	ns.disableLog("sleep");
	while(true)
	{
		await doContracts(ns);
		await ns.sleep(5 * 60 * 1000);
	}
}