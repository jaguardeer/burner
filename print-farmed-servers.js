/** @param {NS} ns **/

import {isBeingFarmed} from "/farm/smart/smart-lib.js"
import {getAllServers} from "/lib/lib.js"

export async function main(ns)
{
	const farmedServers = getAllServers(ns).filter((host) => isBeingFarmed(ns, host));
	for(const host of farmedServers)
	{
		ns.tprint(host);
	}
}