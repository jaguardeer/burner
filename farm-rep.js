/** @param {NS} ns **/
/*
	TODO
	- get all factions within (needed / favor) of goal to avoid overgrinding from passive rep
*/
export async function main(ns)
{
	ns.disableLog("ALL");
	// generate aug info table {augName, soldBy, repReq}
	const player = ns.getPlayer();
	const ownedAugs = ns.getOwnedAugmentations(true);
	const factions = player.factions;
	const augNames = Array(...new Set(factions.flatMap(ns.getAugmentationsFromFaction).filter(a => !ownedAugs.includes(a))));
	const augInfos = augNames.map(augName => ({
		name: augName,
		soldBy: factions.filter(f => ns.getAugmentationsFromFaction(f).includes(augName)),
		repReq: ns.getAugmentationRepReq(augName)
	}));
	// find highest rep req for exclusive augs
	const exclusiveAugs = augInfos.filter(aug => aug.soldBy.length == 1);
	const factionRepReqs = Object.fromEntries(factions.map(f => [f, 0]));
	for(const aug of exclusiveAugs)
	{
		const faction = aug.soldBy[0]
		factionRepReqs[faction] = Math.max(factionRepReqs[faction], aug.repReq);
	}
	// find best faction for non exclusive augs
	const sharedAugs = augInfos.filter(aug => aug.soldBy.length != 1);
	for(const aug of sharedAugs)
	{
		const bestFaction = aug.soldBy.reduce((best, next) => factionRepReqs[best] > factionRepReqs[next] ? best : next);
		factionRepReqs[bestFaction] = Math.max(factionRepReqs[bestFaction], aug.repReq);
	}

	// grind rep, highest rep first
	for(const [faction, repReq] of Object.entries(factionRepReqs).sort((a, b) => a[1] > b[1] ? -1 : 1))
	{
		const repNeeded = repReq - ns.getFactionRep(faction);
		if(repNeeded > 0)
		{
			ns.print("working " + faction + " until " + repReq + ", " + Math.ceil(repNeeded) + " needed");
			if(["hacking", "security", "field"].some(workType => ns.workForFaction(faction, workType, true)))
				while(repReq > (ns.getFactionRep(faction) + ns.getPlayer().workRepGained)) await ns.sleep(5000);
			else ns.print(`failed to work for ${faction}`);
		}
	}
}