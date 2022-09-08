/** @param {NS} ns **/

function getGangRespectLevel(ns)
{
	return ns.gang.getGangInformation().respect;
}

function getRespectNeededToRecruit(ns)
{
	// First 3 gang members are free (can be recruited at 0 respect)
	const numFreeMembers = 3;
	const numGangMembers = ns.gang.getMemberNames().length;
	if (numGangMembers < numFreeMembers) return 0;
	// each member past 3 costs 5x more
	const i = numGangMembers - (numFreeMembers - 1);
	return Math.pow(5, i);
}

export async function main(ns)
{
	const memberNamePrefix = "m";
	let memberNum = ns.gang.getMemberNames().length;
	while(ns.gang.canRecruitMember())
	{
		const memberName = `${memberNamePrefix}${memberNum}`;
		memberNum++;
		if(!ns.gang.recruitMember(memberName))
		{
			ns.tprint("ERROR: tried to recruit but failed");
			return;
		}
		if(!ns.gang.setMemberTask(memberName, "Train Combat"))
		{
			ns.tprint("ERROR: recruited member, failed to set task");
			return;
		}
	}

	let f = ((str) => ns.nFormat(str, "0.00a"));
	ns.tprint(`next member: ${f(getRespectNeededToRecruit(ns))}. current: ${f(getGangRespectLevel(ns))}`);
}