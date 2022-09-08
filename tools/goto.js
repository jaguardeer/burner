export function autocomplete(data, args) {return [...data.servers];}

import {goto} from "/lib/goto.js"

export async function main(ns)
{
	if(ns.args.length != 1)
	{
		ns.tprint("Usage: goto.js target");
		return;
	}
	
	let target = ns.args[0];
	goto(ns, target);
}