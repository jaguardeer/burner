/** @param {NS} ns **/

function startTraining(ns, stat)
{
	const gymCity = "Sector-12";
	ns.travelToCity(gymCity);
	ns.gymWorkout("powerhouse gym", stat, false);
}

async function trainTo(ns, stat, goal)
{
	startTraining(ns, stat);
	while(ns.getPlayer()[stat] < goal) await ns.share();
}

export async function main(ns)
{
	const goal = ns.args[0] ? ns.args[0] : 300;
	const stats = ["strength", "agility", "defense", "dexterity"];
	for(const stat of stats) await trainTo(ns, stat, goal);
}