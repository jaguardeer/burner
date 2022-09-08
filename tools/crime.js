/** @param {NS} ns **/

const crimes = ["shoplift","rob store","mug someone","larceny","deal drugs",
	"bond forgery","traffick illegal arms","homicide","grand theft auto",
	"kidnap and ransom","assassinate","heist"];

function chooseBestCrime(ns)
{
	let bestValue = 0;
	let bestCrime = null;
	for(const crime of crimes)
	{
		const stats = ns.getCrimeStats(crime);
		const chance = ns.getCrimeChance(crime);
		const value = stats.money * chance / stats.time;

		if(value > bestValue)
		{
			bestValue = value;
			bestCrime = crime;
		}
	}
	return bestCrime;
}

export async function main(ns)
{
	// usage: crime.js [minutes]
	// picks the best crime and spams it for provided number of minutes
	// default 1 minute
	let timeRemaining = (ns.args.length > 0 ? ns.args[0] : 1) * 60 * 1000;
	const crime = chooseBestCrime(ns);
	const crimeTime = ns.getCrimeStats(crime).time;
	while(timeRemaining > 0)
	{
		ns.commitCrime(crime);
		timeRemaining -= crimeTime;
		while(ns.isBusy()) await ns.sleep(100);
	}
}