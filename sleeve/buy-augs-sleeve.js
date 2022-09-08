/** @param {NS} ns **/
export async function main(ns)
{
	for(let i = 0 ; i < ns.sleeve.getNumSleeves() ; i++)
	{
			const augList = ns.sleeve.getSleevePurchasableAugs(i);
			for(const aug of augList) 
			{
				//ns.tprint(aug);
				const stats = ns.getAugmentationStats(aug.name);
				if(stats.hacking_mult || stats.hacking_exp_mult)
				{
					ns.sleeve.purchaseSleeveAug(i, aug.name);
				}
			}
	}
}