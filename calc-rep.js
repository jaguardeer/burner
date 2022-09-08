/** @param {NS} ns **/


function calcRepForDonate(ns, faction)
{
	const donateFavor = ns.getFavorToDonate();
	const totalRep = calcRepForFavor(ns, donateFavor);
	const pastRep = calcPastRep(ns, faction);

	return totalRep - pastRep;
}

function calcRepForFavor(ns, favor)
{
	const totalRepNeeded = 25500 * Math.pow(1.02, favor - 1) - 25000;
	return totalRepNeeded;
}

function calcPastRep(ns, faction)
{
	const favor = ns.getFactionFavor(faction);
	return calcRepForFavor(ns, favor);
}

import {calcDonationNeeded} from "/buy-augmentations.js"
export async function main(ns)
{
	const faction = ns.args[0];
	const repNeeded = calcRepForDonate(ns, faction);
	ns.tprint("rep needed for donation to " + faction + " : " + ns.nFormat(repNeeded, "0.00a"));

	/*
	// rates calcs
	const player = ns.getPlayer();
	const bitnode = ns.getBitNodeMultipliers();
	ns.tprint(player.workRepGained);
	const factionMult = 1 + 0.01 * ns.getFactionFavor(faction);
	ns.tprint(player.faction_rep_mult);
	ns.tprint(player.workRepGainRate)// * factionMult * player.faction_rep_mult);
	ns.tprint(bitnode.FactionWorkRepGain);
	*/

	/*
	const player = ns.getPlayer();
	const repMult = player.faction_rep_mult;
	const donation = 1e9;
	const div = 1e6;
	const repGain = donation * repMult / div;
	ns.tprint(ns.nFormat(repGain, "0.00a"));

	ns.tprint(ns.nFormat(calcDonationNeeded(ns, repGain), "0.00a"));
	*/
}