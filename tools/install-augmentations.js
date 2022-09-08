/** @param {NS} ns **/

import {factions} from "/lib/factions.js"
import {findBestSeller} from "/buy-augmentations.js"

async function dumpCash(ns)
{
	// max home ram
	while(ns.upgradeHomeRam());
	// max neuroflux without donation
	const player = ns.getPlayer();
	const faction = player.factions.reduce((prev, curr) => ns.getFactionRep(prev) > ns.getFactionRep(curr) ? prev : curr);
	while(ns.purchaseAugmentation(faction, "NeuroFlux Governor"));
	// max cores
	while(ns.upgradeHomeCores());
	let neuroSeller = findBestSeller(ns, "NeuroFlux Governor");
	let neuroPrice = neuroSeller.donation + ns.getAugmentationPrice("NeuroFlux Governor");
	// max neuroflux with donation
	while(ns.getServerMoneyAvailable("home") >= neuroPrice)
	{
		ns.donateToFaction(neuroSeller.faction, neuroSeller.donation);
		const success = ns.purchaseAugmentation(neuroSeller.faction, "NeuroFlux Governor");
		if(!success) break;
		neuroSeller = findBestSeller(ns, "NeuroFlux Governor");
		neuroPrice = neuroSeller.donation + ns.getAugmentationPrice("NeuroFlux Governor");
	}
	if(ns.getServerMoneyAvailable("home") >= ns.getAugmentationPrice("NeuroFlux Governor"))
	{
		const skip = await ns.prompt("Can still afford NeuroFlux ( " + ns.nFormat(neuroSeller.donation, "0.0a") + " donation)\nInstall anyway?")
		return skip;
	}
	return true;
}

export async function main(ns)
{
	ns.stopAction();
	await ns.sleep(250);
	const dumpSuccess = await dumpCash(ns);
	if(!dumpSuccess) return;
	const commit = await ns.prompt("Install augments?")
	if(commit) ns.installAugmentations("/post-augment/start.js");
	else ns.alert("You a bitch")
}