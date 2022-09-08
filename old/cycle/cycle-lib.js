/** @param {NS} ns **/

export async function waitForSignal(ns, port, signal)
{

}

export async function cycleWeak(ns, target, port, signal)
{
	while(true)
	{
		await waitForSignal(ns, port, signal);
		ns.weaken(target);
	}
}

export async function cycleHack(ns, target, port, signal)
{
	while(true)
	{
		await waitForSignal(ns, port, signal);
		ns.hack(target);
	}
}

export async function cycleGrow(ns, target, port, signal)
{
	while(true)
	{
		await waitForSignal(ns, port, signal);
		ns.grow(target);
	}
}

export async function main(ns)
{
	const min_spacing = 2 * 1000;
	
	ns.tprint("test");
}