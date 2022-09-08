/** @param {NS} ns **/

function* test(n = 3)
{
	for(let i = 0 ; i < n ; i++)
	{
		yield i;
	}
}

function* genScriptCost(ns)
{
	const baseScriptCost = 1.6;
	const funcScripts = ns.ls("home").filter(fn => fn.startsWith("/ns/"));
	//ns.tprint(funcScripts);
	for(const script of funcScripts)
	{
		//yield script;
		yield {fn: script, cost: ns.getScriptRam(script) - baseScriptCost};
	}
}

export async function main(ns)
{
	//let generator = genScriptCost(ns);
	const costs = [...genScriptCost(ns)].sort((a, b) => a.cost > b.cost ? -1 : 1);
	ns.tprint(costs.map(c => `fn: ${c.fn}     cost: ${c.cost}`).join("\n"));
	/*
	for(let i of genScriptCost(ns))
	{
		ns.tprint(i);
	}
	*/
}