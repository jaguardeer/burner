/** @param {NS} ns **/

import {augmentations} from "/cache/augment/augmentations.js"
import {tableToString} from "/lib/lib.js"

export function autocomplete(data, args){return augmentations.map(a => a.name)}


function printAugmentation(ns, name)
{
	let augData = "";
	for(const a of augmentations)
	{
		if(a.name == name)
		{
			augData = [["sold by:", a.soldBy],["reputation:", ns.nFormat(ns.getAugmentationRepReq(a.name),"0a")]].concat(Object.keys(a.stats).map(k => [k, a.stats[k]]));
		}
	}

	if(augData.length > 0) ns.tprint(name + "\n" + tableToString(augData));
	else ns.tprint(name + " was not found");
}

export async function main(ns)
{
	const aug = ns.args.join(" ");
	printAugmentation(ns, aug);
}