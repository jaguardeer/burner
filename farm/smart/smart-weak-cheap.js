/** @param {NS} ns **/
export async function main(ns)
{
	while(1)
	{
		await ns.weaken(ns.args[0]);
	}
}