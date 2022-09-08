/** @param {NS} ns **/
export async function main(ns)
{
	const target = ns.args[0];
	const min_sec = ns.getServerMinSecurityLevel(target);
	while(true)
	{
		while(ns.getServerSecurityLevel(target) > min_sec) await ns.share();
		await ns.grow(target);
	}
}