/** @param {NS} ns **/
export const autocomplete = (data) => data.servers;

export async function main(ns)
{
	while(1)
	{
		await ns.weaken(ns.args[0]);
	}
}