/** @param {NS} ns **/

function func(ns)
{
	ns.tprint("hey");
}

export async function main(ns)
{
	//ns.tprint(Object.keys(ns).join("\n"))

	ns.alterReality = () => func(ns);
	ns.alterReality();
	ns.tprint(ns.getServerMaxMoney);
}