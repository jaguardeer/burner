/** @param {NS} ns **/

function calcCrimeChance(ns, player, crimeName)
{
	const stats = ["hacking", "strength", "defense", "dexterity", "agility", "charisma", "intelligence"];
	const crimeStats = {...execAsync(ns, "ns.getCrimeStats(crimeName)"), intelligence_success_weight: 0.025};
	const statWeights = stats.reduce((sum, stat) => sum += player[stat] * crimeStats[`${stat}_success_weight`], 0) / 975;
	const intBonus = 1 + Math.pow(player.intelligence, 0.8) / 600;
	const chance = statWeights * player.crime_success_mult * intBonus / crimeStats.difficulty;
	return Math.min(chance, 1);
}

// todo: correct crime success mult
async function sleevePlayerProxy(ns, sleeveID)
{
	const stats = await execAsync(ns, `ns.sleeve.getSleeveStats(${sleeveID})`);
	const playerProxy = {...stats, intelligence: 1, crime_success_mult: 1};
	return playerProxy;
}

// execute commands in another script and return results through a port
// use this to avoid ram costs
async function execAsync(ns, func, ...args)
{
	const script = `/${func.replaceAll(".", "/")}.js`;
	const uuid = crypto.randomUUID();
	const port = 1;// TODO: choose port smarterly
	const sleepTime = 50;

	// keep trying to run script until success
	const tryRun = () => ns.run(script, 1, port, uuid, JSON.stringify([...args]));
	let pid = tryRun();
	if(pid === 0)
	{
		ns.print(`awaiting RAM for ${script}`)
		do await ns.sleep(sleepTime); while (tryRun() === 0);
	}
	// wait for data to be in port
	let blob;
	while((blob = ns.peek(port)) === "NULL PORT DATA") await ns.sleep(sleepTime);
	// check port until my uuid is in front
	const checkResult = () => JSON.parse(ns.peek(port));
	let result = checkResult();
	if(result.uuid !== uuid)
	{
		ns.print(`awaiting ${func} on port${port}`);
		do await ns.sleep(sleepTime); while ((result = checkResult()).uuid !== uuid);
	}
	ns.readPort(port); // cleanup data
	return result.data;
}

export async function main(ns)
{
	//ns.disableLog();
	ns.disableLog("run");
	ns.disableLog("sleep");
	const player = ns.getPlayer();
	const server = ns.getServer("n00dles");
	const weakTime = ns.formulas.hacking.weakenTime(server, player);
	ns.tprint(`local weakTime: ${weakTime}`);
	const player2 = await execAsync(ns, "ns.getPlayer")
	const server2 = await execAsync(ns, "ns.getServer", "n00dles");
	const weakTime2 = await execAsync(ns, "ns.formulas.hacking.weakenTime", server2, player2);
	ns.tprint(`async weakTime: ${weakTime2}`);
	//const pid = await execAsync(ns, "ns.print")
	/*
	for(let i = 0 ; i < await execAsync(ns, "ns.sleeve.getNumSleeves") ; i++)
	{
		ns.tprint(i);
		//execAsync("ns.sleeve.setToCommitCrime(i, bestCrime)");
	}
	*/
}