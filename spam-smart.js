/** @param {NS} ns **/
export async function main(ns)
{
	while(true)
	{
		ns.run("/farm/smart/smart-setup.js")
		await ns.sleep(10000);
	}
}