/** @param {NS} ns **/

import {solo} from "/lib/solo.js"

import {largestPrimeFactor} from "/contract/largest-prime.js"
import {mergeOverlappingIntervals} from "/contract/merge-intervals.js"
import {spiralizeMatrix} from "/contract/spiralize.js"
import {stockTrader1, stockTrader2, stockTrader3, stockTrader4} from "/contract/stock-trader.js"
import {subarrayWithMaximumSum} from "/contract/subarray-max-sum.js"
import {arrayJumpingGame, generateIPAddresses, minPathSumTriangle} from "/contract/other-todo.js"
import {uniquePathsGrid1, uniquePathsGrid2} from "/contract/unique-paths.js"
import {findValidMathExpressions} from "/contract/math-expression.js"

export function getSolutionFunc(contractType)
{
	let solution = {}
	solution["Find Largest Prime Factor"] = largestPrimeFactor;
	solution["Merge Overlapping Intervals"] = mergeOverlappingIntervals;
	solution["Spiralize Matrix"] = spiralizeMatrix;
	solution["Algorithmic Stock Trader I"] = stockTrader1;
	solution["Algorithmic Stock Trader II"] = stockTrader2;
	solution["Algorithmic Stock Trader III"] = stockTrader3;
	solution["Algorithmic Stock Trader IV"] = stockTrader4;
	solution["Subarray with Maximum Sum"] = subarrayWithMaximumSum;
	solution["Array Jumping Game"] = arrayJumpingGame;
	solution["Generate IP Addresses"] = generateIPAddresses;
	solution["Unique Paths in a Grid I"] = uniquePathsGrid1;
	solution["Unique Paths in a Grid II"] = uniquePathsGrid2;
	solution["Minimum Path Sum in a Triangle"] = minPathSumTriangle;
	solution["Find All Valid Math Expressions"] = findValidMathExpressions;

	return solution[contractType];
}

// USED BY getDisabledTypes AND disableSolutionFunc
const disabledTypesFile = "/contract/disable.js";

// returns array of strings that should match codingcontract.getContractType
async function getDisabledTypes(ns)
{
	if(!await solo(ns, "ns.fileExists", disabledTypesFile)) return [""];
	const blob = ns.read(disabledTypesFile);
	let disabledTypes = JSON.parse(blob);
	return disabledTypes;
}

async function disableSolutionFunc(ns, type)
{
	let disabledTypes = await getDisabledTypes(ns);
	disabledTypes.push(type);
	await ns.write(disabledTypesFile, JSON.stringify(disabledTypes), "w");
}

async function gotWrongContract(ns, host, filename, type, data, answer)
{
	await disableSolutionFunc(ns, type);
	const objDump = 
	{
		host: host,
		filename: filename,
		type: type,
		data: data,
		answer: answer
	}
	const dumpFile = "/contract/dumps/"+host+"."+filename+".js";
	await ns.write(dumpFile, JSON.stringify(objDump), "w");
}


export async function solveContract(ns, host, filename)
{
	const type = await solo(ns, "ns.codingcontract.getContractType", filename, host);
	const data = await solo(ns, "ns.codingcontract.getData", filename, host);
	
	const solutionFunc = getSolutionFunc(type);
	let disabledTypes = await getDisabledTypes(ns);

	// EARLY EXITS
	if(disabledTypes.includes(type))
	{
		ns.tprint("solutionFunc for " + type + " is disabled (" + filename + " on " + host + ")");
		return;
	}
	if(solutionFunc == null)
	{
		ns.tprint("no solutionFunc for " + type + "," + filename + " on " + host);
		return;
	}
	// SOLUTIONFUNC RETURNS NULL IF IT DOESN'T KNOW THE ANSWER
	const answer = await solutionFunc(data, ns);
	if(answer == null)
	{
		ns.tprint("null answer for " + type + "," + filename + " on " + host);
		return;
	}
	// ATTEMPT TO ANSWER
	const result = await solo(ns, "ns.codingcontract.attempt", answer, filename, host, {returnReward: true});
	if(result == "")
	{
		await gotWrongContract(ns, host, filename, type, data, answer);
		ns.tprint("ERROR! GOT A WRONG ANSWER FOR " + filename + " ON " + host);
	}
	else ns.tprint(result);
}