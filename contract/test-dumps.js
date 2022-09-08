/** @param {NS} ns **/

import {getSolutionFunc} from "/contract/solve-contract.js"

export async function main(ns)
{
	const dumpDir = "/contract/dumps/";
	const dumpFiles = ns.ls(ns.getHostname(), dumpDir);

	for(const file of dumpFiles)
	{
		const contract = JSON.parse(ns.read(file));
		const func = getSolutionFunc(contract.type);
		const answer = func(contract.data);
		ns.tprint("type : " + contract.type);
		ns.tprint("data : " + contract.data);
		ns.tprint("old answer : " + contract.answer);
		ns.tprint("new answer : " + answer);
	}
}