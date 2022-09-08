/** @param {NS} ns **/

// execute a command in its own thread and return results through a port
// use this to avoid ram costs
export async function solo(ns, func, ...args)
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

}