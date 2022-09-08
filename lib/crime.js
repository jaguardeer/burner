/** @param {NS} ns **/

import {crimeStats} from "/cache/augment/crimeStats.js"
import {crimes} from "/lib/crimes.js"

/*
export async function crimeStats()
{
	await import("/lib/cache/augment/crimeStats.js")
}
*/

// picks the crime that offers the best stat / time
export function chooseBestCrime(ns, valueStat = "money")
{
	let bestCrime = null;
	let bestValue = 0;
	for(const crime of crimeStats)
	{
		const chance = ns.getCrimeChance(crime.type);
		const value = crime[valueStat] / crime.time * chance;
		//ns.tprint(crime.name + " : " + crime[valueStat] + " / " + crime.time + " * " + chance);

		if(value > bestValue)
		{
			bestValue = value;
			bestCrime = crime.type;
		}
	}
	return bestCrime;
}




export async function main(ns)
{

}