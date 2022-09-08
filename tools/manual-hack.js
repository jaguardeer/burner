export function autocomplete(data, args) {return [...data.servers];}

import {goto} from "/lib/goto.js"

export async function main(ns)
{
	// INIT
	const target = ns.args[0];
	if(!ns.hasRootAccess(target))
	{
		ns.tprint("ERROR: you need root access to backdoor " + target);
		return;
	}
	// FIND PATH
	goto(ns, target);
	await ns.installBackdoor();
	ns.connect("home");
}