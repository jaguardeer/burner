/** @param {NS} ns **/
export async function main(ns)
{
	const port = ns.getPortHandle(1);
	for(let i = 0 ; i < 10 ; i++)
	{
		port.write(i * 5);
	}
	ns.tprint(port.data.pop());
	for(const i in port) ns.tprint(i);
	ns.tprint(Object.keys(port));
}