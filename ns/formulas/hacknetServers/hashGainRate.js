export async function main(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	const [port, uuid, blob] = ns.args;
	const args = JSON.parse(blob);
	const result = await ns.formulas.hacknetServers.hashGainRate(...args);
	const portData = JSON.stringify({uuid: uuid, data: result});
	ns.print("writing data to port...");
	while(!ns.tryWritePort(port, portData)) await ns.sleep(50);
}