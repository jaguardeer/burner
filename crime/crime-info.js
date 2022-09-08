/** @param {NS} ns **/
import {crimes} from "/lib/crime.js"
import {printTable} from "/lib/lib.js"

export function autocomplete(data, args){return [...crimes];}


export async function main(ns)
{const crimeName = ns.args.join(" ");

	//const crime = crimes.find(c => ns.getCrimeStats(c).name == crimeName);
	const allCrimeInfo = crimes.map(ns.getCrimeStats);
	const intCrimes = allCrimeInfo.filter(c => c.intelligence_exp > 0).map(c => ({
		name: c.name,
		exp: c.intelligence_exp,
		rate: ns.nFormat(c.intelligence_exp / c.time * 1000, "0.0e+0")
	}));
	ns.tprint(intCrimes.map(JSON.stringify).join("\n"));

	const stats = ns.getCrimeStats(crimeName);

	ns.tprint(JSON.stringify(stats, null, 2));
}