/** @param {NS} ns **/

import {getRootServers} from "/lib/lib.js"
import {isBeingFarmed} from "/farm/smart/smart-lib.js"

export async function main(ns)
{
	ns.disableLog("sleep");
	const targets = getRootServers(ns).filter(
		server => !isBeingFarmed(ns, server)
		&& server != "home"
		&& server != "darkweb"
		&& ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()
		&& ns.getServerMaxMoney(server) > 0
	);
	for(const target of targets)
	{
		ns.tprint(target);
		ns.run("/farm/prepare/prepare.js", 1, target);
		await ns.sleep(250);
	}
}