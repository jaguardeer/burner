/** @param {NS} ns **/

/*
GENERATE WORLD
GENERATE SERVER INFO - max cash, grow factor, hack level required
GENERATE CRIME STATS

RESET PURCHASED SERVERS
*/

//import {factions} from "/lib/factions.js"
import {clearAugmentCache, cacheServerInfo, cacheAugmentationInfo, cacheCrimeStats} from "/lib/cache.js"


export async function main(ns)
{
	await clearAugmentCache(ns);
	await cacheServerInfo(ns);
	await cacheCrimeStats(ns);
	await cacheAugmentationInfo(ns);
}

function testServerInfo(ns)
{
	
}