/** @param {NS} ns **/

export async function stockTrader1(contractData, ns)
{
	const maxTrades = 1;
	const stockData = contractData;
	const allTrades = genStockTrades(stockData, ns);
	const limitedTrades = reduceTradesTo(allTrades, maxTrades, ns);
	//ns.tprint(limitedTrades);
	const answer = calcTradesProfit(limitedTrades)
	//ns.tprint(limitedTrades);
	//ns.tprint(answer)
	return answer;
}

export async function stockTrader2(contractData, ns)
{
	const trades = genStockTrades(contractData, ns);
	//ns.tprint(trades);
	//ns.tprint(contractData);
	return calcTradesProfit(trades);
}

export async function stockTrader3(contractData, ns)
{
	const maxTrades = 2;
	const stockData = contractData;
	const allTrades = await genStockTrades(stockData, ns);
	const limitedTrades = await reduceTradesTo(allTrades, maxTrades, ns);
	return calcTradesProfit(limitedTrades);
}

export async function stockTrader4(contractData, ns)
{
	const maxTrades = contractData[0];
	const stockData = contractData[1];
	const allTrades = await genStockTrades(stockData, ns);
	//ns.tprint(allTrades.map(e => [e.min, e.max]));
	const limitedTrades = await reduceTradesTo(allTrades, maxTrades, ns);
	//ns.tprint(limitedTrades.map(e => [e.min, e.max]));
	return calcTradesProfit(limitedTrades);
}


// genStockTrades
// takes: 	raw contract data
// returns:	array of profitable trades
// input  -> [205,200,4,48,115,8,136,104,52,98,41,144,153,86,110,176,72,147,84,1]
// output -> [[4,115],[8,136],[52,98],[41,153],[86,176],[72,147]]
function genStockTrades(data, ns)
{
	let stockTrades = [];
	let i = 0;
	while(i < data.length - 1)
	{
		//await ns.sleep(100);
		//ns.tprint(i);
		while(data[i] >= data[i + 1]) i++;
		let min = data[i];
		//await ns.sleep(100);
		//ns.tprint(i + " " + min);
		while(data[i] <= data[i + 1]) i++;
		let max = data[i];
		//await ns.sleep(100);
		//ns.tprint(i + " " + max);
		if(min != max) stockTrades.push({min: min, max: max});
	}
	//ns.tprint(stockTrades.map(t => [t.min, t.max]));
	return stockTrades;
}

// reduceStockTrades
// reduces a trade from stockTrades while preserving profit
function reduceStockTrades(stockTrades, ns)
{
	const startProfit = calcTradesProfit(stockTrades);
	let bestProfit = -1;
	let bestTrades = [];
	// find best trade to merge
	for(let i = 0 ; i < stockTrades.length - 1 ; i++)
	{
		let hypo = stockTrades.map(t => t);
		let a = hypo[i];
		let b = hypo[i + 1];
		let opt1 = {min: a.min, max: a.max};
		let opt2 = {min: a.min, max: b.max};
		let opt3 = {min: b.min, max: b.max};
		let profit = trade => trade.max - trade.min;
		let best = [opt1, opt2, opt3].reduce((p, c) => profit(c) > profit(p) ? c : p);
		//const min = Math.min(hypo[i].min, hypo[i + 1].min);
		//const max = Math.max(hypo[i].max, hypo[i + 1].max);
		hypo.splice(i, 2, best);
		//ns.tprint(hypo);
		const hypoProfit = calcTradesProfit(hypo);
		if(hypoProfit > bestProfit)
		{
			bestProfit = hypoProfit;
			bestTrades = hypo.map(t => t);
		}
	}
	//ns.tprint(bestTrades.map(t => [t.min, t.max]));
	return bestTrades;
}

function calcTradesProfit(stockTrades)
{
	return stockTrades.reduce((p, c) => p += c.max - c.min, 0);
}

function reduceTradesTo(stockTrades, numTrades, ns)
{
	let newTrades = stockTrades.map(e => e);
	//ns.tprint("asdoiah" + newTrades);
	while(newTrades.length > numTrades)
	{
		//await ns.sleep(100);
		//ns.tprint(newTrades);
		newTrades = reduceStockTrades(newTrades, ns);
	}
	//ns.tprint(newTrades.map(t => [t.min, t.max]));
	//ns.tprint(newTrades);
	return newTrades;
}