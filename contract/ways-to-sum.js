/** @param {NS} ns **/

// returns the number of ways you can sum to n, using numbers up to k
function snk(n, k = n, memo = {})
{
	const key = `${n},${k}`;
	if(key in memo) return memo[key];
	else
	{
		let result = 0;
		if(k < 1) result = 0;
		else if(n <= 1 || k === 1) result = 1;
		else if(n < k) result = snk(n, n, memo);
		else for(let i = n - k ; i < n ; i++) result += snk(i, n - i, memo);
		memo[key] = result;
		return result;
	}
}

// returns the number of ways you can sum to n, using numbers up to k
function partition(n)
{
	let tab = Array(n + 1).fill(0);
	tab[0] = 1;
	for(let i = 1 ; i <= n ; i++)
	{
		for(let j = i ; j <= n ; j++)
		{
			tab[j] += tab[j - i];
		}
	}
	return tab[n];
}

export async function main(ns)
{
	for(let i = 0 ; i <= 10 ; i++)
	{	
		ns.tprint(partition(i))
	}
	let start;
		
	// measure snkTab
	start = performance.now();
	ns.tprint(snkTab(10000));
	ns.tprint(`snkTab took ${performance.now() - start} ms`);

	// measure snk
	start = performance.now();
	//ns.tprint(snk(1000));
	//ns.tprint(`snk took ${performance.now() - start} ms`);
}