/** @param {NS} ns **/
export async function main(ns)
{
	const pid = ns.args[0];
	const scriptInfo = ns.getRunningScript(pid);
	if(scriptInfo)
	{
		const {server, filename, args, logs, onlineRunningTime} = scriptInfo;
		const header = [server, filename, ...args].join(" ");
		ns.tprint(`${header}\n${ns.tFormat(onlineRunningTime*1000)} online\n${logs.join("\n")}`)
	}else{
		ns.tprint(`script not found: ${pid}`);
	}
}