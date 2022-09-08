/** @param {NS} ns **/
export function autocomplete(data){return data.servers}

export async function main(ns)
{
	ns.tprint(ns.getSharePower());
}