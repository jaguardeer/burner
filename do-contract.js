/** @param {NS} ns **/

import {solveContract} from "/contract/solve-contract.js"
import {serverInfo} from "/cache/augment/serverInfo.js"
import {solo} from "/lib/solo.js"

export async function doContracts(ns)
{
	for(const server of serverInfo)
	{
		const files = await solo(ns, "ns.ls", server.hostname);
		const contracts = files.filter(fn => fn.endsWith(".cct"));
		for(const file of contracts) await solveContract(ns, server.hostname, file);
	}
}

export async function main(ns)
{
	await doContracts(ns);
}