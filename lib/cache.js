/** @param {NS} ns **/


/*
	THIS IS A LIBRARY FOR INTERACTING WITH CACHES
*/

// GLOBAL CONSTANTS
const cacheDir = "/cache/";
const augmentCache = cacheDir + "augment/";
const home = "home";
import {factions} from "/lib/factions.js";
import {getAllServers} from "/lib/lib.js"



export async function clearAugmentCache(ns)
{
	const files = ns.ls(home, augmentCache);
	for(const file of files) ns.rm(file, home);
}

// cacheServerInfo
// caches info about servers:
// - name, cores, ram
// - static farming info
// - hack requirements
export async function cacheServerInfo(ns)
{
	//const excludeServers = ["home", "darkweb", ...ns.getPurchasedServers()];
	const servers = getAllServers(ns);//.filter((server) => !excludeServers.includes(server));
	let serverInfos = [];
	for(const server of servers)
	{
		let serverObject = ns.getServer(server);
		serverObject.hackDifficulty = serverObject.minDifficulty;
		serverObject.moneyAvailable = serverObject.moneyMax;
		/*
		const cachedObject = 
		{
			hostname: serverObject.hostname,					// general info
			cpuCores: serverObject.cpuCores,
			maxRam: serverObject.maxRam,
			organizationName: serverObject.organizationName,	
			moneyMax: serverObject.moneyMax,					// farming info
			serverGrowth: serverObject.serverGrowth,
			minDifficulty: serverObject.minDifficulty,
			requiredHackingSkill: serverObject.requiredHackingSkill,
			numOpenPortsRequired: serverObject.numOpenPortsRequired
		};
		*/
		serverInfos.push(serverObject);
	}

	await writeCache(ns, augmentCache, "serverInfo", serverInfos);
}



// cacheAugmentationInfo
// caches augmentations available in this bitnode
// - stats
// - who sells it
// - base price? not implemented yet
// - TODO: REP COST
export async function cacheAugmentationInfo(ns)
{	
	// AUGMENTATIONS LIST
	let augs = [];
	for(const faction of factions)
	{
		const factionAugs = ns.getAugmentationsFromFaction(faction);
		for(const fa of factionAugs) if(!augs.includes(fa)) augs.push(fa);
	}
	augs.sort();

	const augsWithStats = augs.map(a => ({
		name: a,
		stats: ns.getAugmentationStats(a),
		soldBy: factions.filter(f => ns.getAugmentationsFromFaction(f).includes(a))
		//soldBy: a == "NeuroFlux Governor" ? [] : factions.filter(f => ns.getAugmentationsFromFaction(f).includes(a))
		}));
	
	await writeCache(ns, augmentCache, "augmentations", augsWithStats);
}


// cacheBotServers
// bot server: hasRootAccess, RAM > 0, not "home"
export async function cacheBotServers(ns)
{
	const purchasedServers = ns.getPurchasedServers();
	const world = [];
	recurseServerConnections(ns, world, "", home);
	ns.tprint(world);
	ns.tprint("CALLED TODO FUNC");
}


// cachePurchasedServers
export async function cachePurchasedServers(ns)
{
	const purchasedServers = ns.getPurchasedServers();
	await writeCache(ns, augmentCache, "purchasedServers", purchasedServers)
}

import {crimes} from "/lib/crimes.js"
export async function cacheCrimeStats(ns)
{
	const crimeStats = crimes.map(ns.getCrimeStats);
	await writeCache(ns, augmentCache, "crimeStats", crimeStats)
}



// writeCache
// generic method for writing a cache
async function writeCache(ns, directory, varName, object)
{
	// object
	const objString= JSON.stringify(object);
	const prefix = "export const ";
	const suffix = " = ";
	const end = ";";
	const finalString = prefix + varName + suffix + objString + end;
	// output file
	const filename = directory + varName + ".js";
	// write
	await ns.write(filename, finalString, "w");
	for(const host of getAllServers(ns))
	{
		if(host != "home") await ns.scp(filename, host);
	}
}