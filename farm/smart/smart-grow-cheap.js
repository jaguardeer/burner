/** @param {NS} ns **/

function prepareLog(ns)
{
	ns.disableLog("ALL");
	ns.enableLog("grow");
}
export async function main(ns)
{
	prepareLog(ns);
	const target = ns.args[0];
	const min_sec = ns.getServerMinSecurityLevel(target);
	while(true)
	{
		while(ns.getServerSecurityLevel(target) > min_sec) await ns.sleep(1000);
		await ns.grow(target);
	}
}