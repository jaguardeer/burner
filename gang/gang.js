/** @param {NS} ns **/
export function autocomplete(){return ["respect", "train", "money"];}

async function ascend(ns)
{
	const members = ns.gang.getMemberNames();
	for(const member of members) ns.gang.setMemberTask(member, "Train Combat");
	while(true)
	{
		for(const member of members)
		{
			const result = ns.gang.getAscensionResult(member);
			//ns.tprint(member + " : " + JSON.stringify(result));
			if(result["hack"] > 1.3)
			{
				ns.gang.ascendMember(member);
				await ns.sleep(500);
				const equips = ns.gang.getEquipmentNames();
				for(const equip of equips)
				{
					const stats = ns.gang.getEquipmentStats(equip);
					if(stats["hack"] > 0) ns.gang.purchaseEquipment(member, equip)
				}
			}
		}
		await ns.sleep(10 * 1000);
	}
}

function setTask(ns, task)
{
	for(const member of ns.gang.getMemberNames()) ns.gang.setMemberTask(member, task);
}

async function respect(ns)
{
	await balanceWantedLevel(ns, "Cyberterrorism");
}

async function money(ns)
{
	await balanceWantedLevel(ns, "Money Laundering");
}

async function balanceWantedLevel(ns, task)
{
	while(true)
	{
		if(0.997 > ns.gang.getGangInformation().wantedPenalty) setTask(ns, "Ethical Hacking");
		else setTask(ns, task);
		await ns.sleep(1000);
	}
}

export async function main(ns)
{
	const pick = ns.args.length > 0 ? ns.args[0] : "train";
	switch(String(pick))
	{
		case "train":
			await ascend(ns);
			break;
		case "respect":
			await respect(ns);
			break;
		case "money":
			await money(ns)
			break;
	}
}