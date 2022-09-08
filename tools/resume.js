/** @param {NS} ns **/
export function autocomplete(data){return [...data.servers]};

export async function main(ns)
{
	let hosts = ns.args.length == 0 ? ["home"] : ns.args;
	for(const host of hosts)
	{
		// READ PROCINFO[] FROM PAUSEFILE
		const pauseDir = "/pause/";
		const pauseFile = pauseDir + host + ".txt";
		if(!ns.fileExists(pauseFile)) break;
		const procBlob = await ns.read(pauseFile);
		let procInfo = JSON.parse(procBlob);

		// FOR EACH PROCESS IN PROCINFO[]
		for(const proc of procInfo)
		{
			// RESUME THE PROCESS
			const success = ns.exec(proc.filename, host, proc.threads, ...proc.args);
			// REMOVE FROM PROCINFO[] ON SUCCESS
			if(success != 0) procInfo = procInfo.filter(p => !p === proc);
		}
		
		// WRITE BACK PROCESSES THAT COULD NOT BE RESUMED (OR DELETE PAUSEFILE)
		if(procInfo.length == 0) ns.rm(pauseFile);
		else ns.write(pauseFile, JSON.stringify(procInfo), "w");
	}
}