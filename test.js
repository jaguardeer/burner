/** @param {NS} ns **/
export async function main(ns)
{
	while(true)
	{
		await ns.stanek.charge(3, 0);
	}
}