/** @param {NS} ns **/

import {execAsync} from "/lib/async.js"
import {crimeStats} from "/cache/augment/crimeStats.js"

async function calcCrimeChance(ns, player, nsCrimeStats)
{
	const stats = ["hacking", "strength", "defense", "dexterity", "agility", "charisma", "intelligence"];
	const crimeStats = {...nsCrimeStats, intelligence_success_weight: 0.025};
	const statWeights = stats.reduce((sum, stat) => sum += player[stat] * crimeStats[`${stat}_success_weight`], 0) / 975;
	const intBonus = 1 + Math.pow(player.intelligence, 0.8) / 600;
	const chance = statWeights * player.crime_success_mult * intBonus / crimeStats.difficulty;
	return Math.min(chance, 1);
}

// todo: correct crime success mult
async function sleevePlayerProxy(ns, sleeveID)
{
	const stats = await execAsync(ns, `ns.sleeve.getSleeveStats`, sleeveID);
	const playerProxy = {...stats, intelligence: 1, crime_success_mult: 1};
	return playerProxy;
}

async function calcBestCrime(ns, sleeveID)
{
	const playerProxy = await sleevePlayerProxy(ns, sleeveID);
	let bestCrime;
	let bestValue = 0;
	for(const crime of crimeStats)
	{
		const chance = await calcCrimeChance(ns, playerProxy, crime);
		const value = crime.money * chance / crime.time;
		if(value > bestValue)
		{
			bestCrime = crime.name;
			bestValue = value;
		}
	}
	return bestCrime;
}

export async function main(ns)
{
	ns.disableLog("ALL");
	//const numSleeves = await execAsync(ns, "ns.sleeve.getNumSleeves");
	//ns.tprint(`you have ${numSleeves} sleeves.`);
	//const player = await sleevePlayerProxy(ns, 0);
	//const crimeChance = await calcCrimeChance(ns, player, "homicide");
	//ns.tprint(`homicide chance: ${ns.nFormat(await calcCrimeChance(ns, await sleevePlayerProxy(ns, 0), "homicide"), "0.00%")}`);
	//return;
	for(let i = 0 ; i < await execAsync(ns, "ns.sleeve.getNumSleeves") ; i++)
	{
		const bestCrime = await calcBestCrime(ns, i);
		ns.tprint(`sleeve${i} : ${bestCrime}`);
		//ns.tprint(`homicide chance: ${await calcCrimeChance(ns, await sleevePlayerProxy(ns, i), "homicide")}`)
		await execAsync(ns, "ns.sleeve.setToCommitCrime", i, bestCrime);
		//ns.sleeve.setToCommitCrime()
	}
}