export async function main(ns)
	{
		await ns.write("/cache/tmp/out/b9806aa2-1529-48ba-8da3-272daf22c326.js", JSON.stringify(ns.sleeve.getNumSleeves()), "w");
	}