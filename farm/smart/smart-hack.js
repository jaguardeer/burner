/** @param {NS} ns **/

export function autocomplete(data, args) { return [...data.servers]; }

export async function main(ns)
{
	const target = ns.args[0];
	const min_sec = ns.getServerMinSecurityLevel(target);
	const max_cash = ns.getServerMaxMoney(target);
	while(true)
	{
		if(min_sec*1.02 >= ns.getServerSecurityLevel(target)
		&& ns.getServerMoneyAvailable(target) > max_cash * 0.95)
		{
			await ns.hack(target);
		}
		else await ns.share();
	}
}