/** @param {NS} ns **/
import {getRootServers} from "/lib/lib.js"
export async function main(ns)
{
	const num = ns.args[0] ? ns.args[0] : 3;
	const targets = getRootServers(ns).sort((a, b) => ns.getServerMaxMoney(a) > ns.getServerMaxMoney(b) ? -1 : 1).slice(0, num);
	for(const target of targets) ns.run("/farm/phreak/launch.js", 1, target)
}