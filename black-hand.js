/** @param {NS} ns **/
import {goto} from "/lib/goto.js"

export async function main(ns)
{
	ns.disableLog("sleep");
	// WAIT FOR 356 HACKING
	while(356 > ns.getHackingLevel()) await ns.sleep(60 * 1000);
	// HACK I.I.I.I
	goto(ns, "I.I.I.I");
	await ns.installBackdoor();
	ns.connect("home");
	while(!ns.checkFactionInvitations().includes("The Black Hand")) await ns.sleep(5000);
	ns.tprint("JOIN THE BLACK HAND");
	//ns.tprint("Joined The Black Hand: " + ns.joinFaction("The Black Hand"));
}