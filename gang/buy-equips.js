/** @param {NS} ns **/

function buyAllEquips(ns)
{
	for(const member of ns.gang.getMemberNames())
	{
		const equipTypesToBuy = ["Weapon", "Armor", "Vehicle"];
		for(const equip of ns.gang.getEquipmentNames())
		{
			const type = ns.gang.getEquipmentType(equip);
			if(equipTypesToBuy.includes(type)) ns.gang.purchaseEquipment(member, equip);
		}
	}
}

export async function main(ns)
{
	if(ns.args.length > 0)
	{
		for(const member of ns.gang.getMemberNames()) ns.gang.purchaseEquipment(member, ns.args.join(" "));
	}else{
		buyAllEquips(ns);
	}
}