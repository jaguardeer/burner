/** @param {NS} ns **/

export function autocomplete(data,args){return [...data.servers];}

export async function main(ns)
{
	const target = ns.args[0];
	const min_sec = ns.getServerMinSecurityLevel(target);
	while(ns.getServerSecurityLevel(target) > min_sec)
	{
		await ns.weaken(target);
	}
}