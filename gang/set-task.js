/** @param {NS} ns **/

export function setTask(ns, taskName)
{
	for(const member of ns.gang.getMemberNames()) ns.gang.setMemberTask(member, taskName);
}

export async function main(ns)
{
	const taskName = ns.args.length > 0 ? ns.args.join(" ") : "Train Combat";
	setTask(ns, taskName);
}