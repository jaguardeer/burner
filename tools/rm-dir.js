/** @param {NS} ns **/
export async function main(ns)
{
	if(ns.args.length !== 1)
	{
		ns.tprint("ERROR: must supply directory");
		return;
	}
	const dir = ns.args[0];
	const files = ns.ls("home").filter(fn => fn.startsWith(dir));

	for(let file of files)
	{
		const confirm = await ns.prompt(`really delete file?\n${file}`);
		if(confirm) ns.rm(file);
	}
}