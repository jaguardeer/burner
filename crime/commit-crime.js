/** @param {NS} ns **/
import {crimes} from "/lib/crimes.js"
import {crimeStats} from "/cache/augment/crimeStats.js"

export function autocomplete(){return crimes;}

export async function main(ns)
{
	// usage: crime.js [numTimes] [crime] 
	// picks the best crime and spams it for provided number of times
	// default Infinity times
	
	if(ns.args.length < 2)
	{
		ns.tprint("usage: commit-crime.js [numTimes] [crime]");
		return;
	}

	let numCrimes = ns.args[0] > 0 ? ns.args[0] : Infinity;
	const crime = ns.args[1];
	const stats = crimeStats.find(c => c.type.includes(crime));
	if(stats == null)
	{
		ns.tprint("ERROR: crime not found (" + crime + ")");
		return;
	}
	const expectedTime = stats.time;
	const crimeType = stats.type;

	while(numCrimes > 0)
	{
		// start crime
		ns.commitCrime(crime);
		numCrimes--;
		// wait for crime to finish (ping every 1 seconds to detect early cancel)
		let elapsedTime = 0;
		while(ns.getPlayer().crimeType == crimeType)
		{
			const waitDur = 1000;
			elapsedTime += waitDur;
			await ns.sleep(waitDur);
		}
		// early cancel detected
		if(elapsedTime < expectedTime - 500)
		{
			ns.toast("crime spree cancelled early", "success");
			return;
		}
	}
	ns.toast("crime spree complete", "success");
}