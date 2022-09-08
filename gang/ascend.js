/** @param {NS} ns **/

import {solo} from "/lib/solo.js"

async function ascendMembers(ns, threshold)
{
	for(const member of await solo(ns, "ns.gang.getMemberNames"))
	{
		/*
		const memberInfo = ns.gang.getMemberInformation(member);
		if(memberInfo.str > 8000)
		{
			ns.gang.setMemberTask(member, "Human Trafficking");
			continue;
		}
		*/
		const ascResult = ns.gang.getAscensionResult(member);
		if(ascResult)
		{
			delete ascResult.respect;
			//ns.tprint(ascResult);
			if(threshold <= Math.max(...Object.values(ascResult)))
			{
				await solo(ns, "ns.gang.ascendMember", member);
				ns.gang.setMemberTask(member, "Train Combat");
			}
		}
	}
}

export async function main(ns)
{
	const threshold = ns.args[0] ? ns.args[0] : 1.5;
	while(true)
	{
		await ascendMembers(ns, threshold);
		await ns.sleep(60 * 1000);
	}
}