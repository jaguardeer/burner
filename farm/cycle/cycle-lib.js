/** @param {NS} ns **/

/*

W - G - W - H -


*/


// getCycleSpacing
// spacing: ms between events (h/g/w)
function getCycleSpacing(ns)
{
	return 250;
}

function calcCycleWidth(ns)
{
	return 4 * getCycleSpacing();
}

function calcMaxCycles(ns)
{
	// cycles could be limited by RAM or by spacing
}


// calcGrowDelay
// delay before launching grow threads
function calcGrowDelay(ns)
{

}

// calcHackDelay
// delay before launching hack threads
function calcHackDelay(ns)
{

}

// startScript
// delay before launching grow threads
function startScript(ns, type)
{
	
}

async function doAfterPromise(ns, promise, string)
{
	await promise;
	ns.tprint(string)
}

export async function main(ns)
{
	/*
	const startTime = performance.now();
	const data = [4, 8, 2].map((i) => ns.asleep(i * 1000));
	for(let i = 0 ; i < data.length ; i++)
	{
		doAfterPromise(ns, data[i], i);
	}
	await Promise.all(data);
	*/
	for(const i of Array(50))
	{
		const startTime = performance.now();
		await ns.sleep(250);
		const endTime = performance.now();
		const duration = endTime - startTime;
		ns.tprint(duration);
	}
	/*
	const promise = ns.asleep(8 * 1000);
	setTimeout(() => ns.tprint("time: " + (performance.now() - startTime) / 1000), 5 * 1000);
	await promise;
	ns.tprint("time's up!");
	ns.tprint("time: " + (performance.now() - startTime) / 1000)
	*/
	//await ns.sleep(10 * 1000);
}