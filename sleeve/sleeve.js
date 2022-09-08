/** @param {NS} ns **/

async function fullSync(ns, sleeveID)
{
	let stats = ns.sleeve.getSleeveStats(sleeveID);
	if(stats.sync < 100) ns.sleeve.setToSynchronize(sleeveID);
	while(stats.sync < 100)
	{
		await ns.sleep(1000);
		stats = ns.sleeve.getSleeveStats(sleeveID);
	}
}

async function fullShock(ns, sleeveID)
{
	let stats = ns.sleeve.getSleeveStats(sleeveID);
	if(stats.shock > 0) ns.sleeve.setToShockRecovery(sleeveID);
	while(stats.shock > 0)
	{
		await ns.sleep(1000);
		stats = ns.sleeve.getSleeveStats(sleeveID);
	}
}

export async function main(ns)
{
	//await fullSync(ns, 0);
	//await fullShock(ns, 0);
	for(let i = 0 ; i < ns.sleeve.getNumSleeves() ; i++)
	{
		//ns.sleeve.travel(i, "Volhaven");
		//ns.sleeve.setToUniversityCourse(i, "zb institute of technology", "algorithms");
		//ns.sleeve.setToShockRecovery(i);
		//ns.sleeve.setToFactionWork(i, "Sector-12", "hacking");
		//ns.sleeve.setToCommitCrime(i, "homicide");
		ns.sleeve.setToCommitCrime(i, "mug");
	}
	//for(let i = 0 ; i < ns.sleeve.getNumSleeves() ; i++) ns.sleeve.setToFactionWork(i, "Sector-12", "security")	;
}