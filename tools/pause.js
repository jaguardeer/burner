/** @param {NS} ns **/
export function autocomplete(data){return [...data.servers]};

export async function main(ns)
{
	let hosts = ns.args.length == 0 ? ["home"] : ns.args;
	for(const host of hosts)
	{
		// GET PROCINFO
		let procInfo = ns.ps(host);
		// FILTER OUT THIS PROCESS
		procInfo = procInfo.filter(p => p.filename != ns.getScriptName(), "a");
		// WRITE PROCINFO TO PAUSEFILE
		const pauseDir = "/pause/";
		const pauseFile = pauseDir + host + ".txt";
		await ns.write(pauseFile, JSON.stringify(procInfo), "w");
		// KILLALL
		ns.killall(host);
	}
}