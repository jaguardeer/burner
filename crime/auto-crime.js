/** @param {NS} ns **/
import {chooseBestCrime} from "/lib/crime.js"
import {crimes} from "/lib/crimes.js"

export function autocomplete(data, args){return [...crimes, "auto"]}

export async function main(ns)
{
	// usage: crime.js [desiredStat] [numTimes] [crime] 
	// picks the best crime and spams it for provided number of times
	// default auto crime
	// default Infinity times

	const desiredStat = ns.args.length > 0 ? ns.args[0] : "money";
	let numTimes = ns.args.length > 1 ? ns.args[1] : Infinity;
	if(numTimes == 0) numTimes = Infinity;
	const pick = ns.args.length > 2 ? ns.args.slice(2).join(" ") : null;

	// don't auto - forward args to end
	if(pick != null || pick == "auto")
	{
		ns.spawn("/crime/commit-crime.js", 1, numTimes, pick);
	}

	const bestCrime = chooseBestCrime(ns, desiredStat);
	ns.print(bestCrime);
	if(bestCrime) ns.spawn("/crime/commit-crime.js", 1, numTimes, bestCrime);
	else ns.tprint("can't find a crime with " + desiredStat);
}