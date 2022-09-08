/** @param {NS} ns **/

import {augmentations} from "/cache/augment/augmentations.js"

/*
let cost = 0;
let costMult = 1;
*/

// returns the amount of money needed to gain X rep
export function calcDonationNeeded(ns, repNeeded)
{
	if(repNeeded <= 0) return 0;
	const repMult = ns.getPlayer().faction_rep_mult;
	const div = 1e6;
	const donation = repNeeded / repMult * div;
	return Math.ceil(donation);
}

function canDonate(ns, faction)
{
	const favorReq = ns.getFavorToDonate();
	const factionFavor = ns.getFactionFavor(faction);
	return factionFavor >= favorReq;
}

export function findBestSeller(ns, augName)
{
	// setup
	const soldBy = augmentations.find(e => e.name == augName).soldBy;
	const repReq = ns.getAugmentationRepReq(augName);
	// iterate over sellers, store best seller so far
	let bestFaction = null;
	let bestDonation = Infinity;
	for(const faction of soldBy)
	{
		const facRep = ns.getFactionRep(faction);
		const repNeeded = repReq - facRep;
		const donation = calcDonationNeeded(ns, repNeeded);
		if(repNeeded <= 0 || (canDonate(ns, faction) && donation < bestDonation))
		{
			bestFaction = faction;
			bestDonation = donation;
		}
	}
	return {faction: bestFaction, donation: bestDonation};
}

function tryBuyAug(ns, augName)
{
	ns.tprint("trying " + augName);
	//try to buy prereqs
	for(const preReq of ns.getAugmentationPrereq(augName)) tryBuyAug(ns, preReq);
	const seller = findBestSeller(ns, augName);
	const augPrice = ns.getAugmentationPrice(augName);
	const finalPrice = augPrice + seller.donation;
	const myMoney = ns.getServerMoneyAvailable("home");
	let bought = false
	//ns.tprint("trying to buy " + augName + " from " + seller.faction);
	if(myMoney > finalPrice)
	{
		//ns.tprint("donating " + ns.nFormat(seller.donation, "0.0a") + " to " + seller.faction + " for " + augName);
		//cost += seller.donation;
		//cost += augPrice * costMult;
		//costMult *= 1.9;
		ns.donateToFaction(seller.faction, seller.donation);
		bought = ns.purchaseAugmentation(seller.faction, augName);
	}
	return bought;
	//if(sellerFaction != null) return ns.purchaseAugmentation(sellerFaction, augName);
}


function getDesiredAugs(desiredStats)
{
	const statMatches = desiredStats.map(stat => augmentations.filter(aug => aug.stats[stat]));
	return Array().concat(...statMatches).map(aug => aug.name);
}

const augStats = 
{
	

/*
agility_exp_mult
agility_mult
bladeburner_analysis_mult
bladeburner_max_stamina_mult
bladeburner_stamina_gain_mult
bladeburner_success_chance_mult
charisma_exp_mult
charisma_mult
company_rep_mult
crime_money_mult
crime_success_mult
defense_exp_mult
defense_mult
dexterity_exp_mult
dexterity_mult
faction_rep_mult
hacking_chance_mult
hacking_exp_mult
hacking_grow_mult
hacking_money_mult
hacking_mult
hacking_speed_mult
hacknet_node_core_cost_mult
hacknet_node_level_cost_mult
hacknet_node_money_mult
hacknet_node_purchase_cost_mult
hacknet_node_ram_cost_mult
strength_exp_mult
strength_mult
work_money_mult
*/

	hacking: [
		"hacking_chance_mult",
		"hacking_exp_mult",
		"hacking_grow_mult",
		"hacking_money_mult",
		"hacking_mult",
		"hacking_speed_mult",
	],
	combat: [
		"agility_exp_mult",
		"agility_mult",
		"defense_exp_mult",
		"defense_mult",
		"dexterity_exp_mult",
		"dexterity_mult",
		"strength_exp_mult",
		"strength_mult",
	],
	faction: [
		"faction_rep_mult"
	]
};

export async function main(ns)
{
	// generate aug list, filter to uniques
	const desiredStats = [...augStats.hacking, ...augStats.faction, ...augStats.combat];
	const augList = getDesiredAugs(desiredStats).filter((v, i, a) => a.indexOf(v) === i).filter((aug) => !ns.getOwnedAugmentations(true).includes(aug));
	// sort by price highest -> lowest
	augList.sort((a,b) => ns.getAugmentationPrice(a) < ns.getAugmentationPrice(b) ? 1 : -1);
	//ns.tprint(augList.join("\n"));
	//return;
	//ns.tprint(augList);
	// buy the augs
	for(const aug of augList)
	{
		const success = tryBuyAug(ns, aug);
		if(success) ns.tprint("bought " + aug);
		//else ns.tprint("couldn't buy " + aug);
	}
	//ns.tprint(ns.nFormat(cost, "0.0a"));
	//ns.tprint(costMult);
}