/** @param {NS} ns **/

async function recurseObjectKeys(ns, object, objectName, path)
{
	let newPath = [...path];
	newPath.push(objectName);
	for(const key in object)
	{
		//await ns.sleep(50);
		if(typeof object[key] === "function")
		{
			const filename = `/${[...newPath, key].join("/")}.js`;
			const func = [...newPath, key].join(".");
			const script = 
`export async function main(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	const [port, uuid, blob] = ns.args;
	const args = JSON.parse(blob);
	const result = await ${func}(...args);
	const portData = JSON.stringify({uuid: uuid, data: result});
	ns.print("writing data to port...");
	while(!ns.tryWritePort(port, portData)) await ns.sleep(50);
}`;
			await ns.write(filename, script, "w");
		}
		else if(typeof object[key] === "object")
		{
			await recurseObjectKeys(ns, object[key], key, newPath)
		}
		else ns.tprint(`${key} : ${typeof key}`);
		//ns.tprint(`${typeof ns[key]} : ${filename}`);
		//await ns.write(filename, data
	}
}

export async function main(ns)
{
	recurseObjectKeys
}