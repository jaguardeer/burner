/** @param {NS} ns **/
export async function main(ns)
{
	while(true)
	{
		if(!ns.isBusy()) 
		{
			const success = ns.universityCourse("rothman university", "study computer science", false);
			if(!success)
			{
				ns.toast("idle-study failed to study", "error");
				return;
			}
		}
		else await ns.sleep(5000)
	}
}