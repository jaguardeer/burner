/** @param {NS} ns **/

function factorial(n)
{
	let result = 1;
	for(let i = 1 ;  i <= n ; i++) result *= i;
	return result;
}

function nCk(n, k)
{
	// n! / (k! * (n - k)!)
	const numer = factorial(n);
	const denom = factorial(k) * factorial(n - k);
	return numer / denom;
}

export function uniquePathsGrid1(contractData, ns)
{
	const downSteps  = contractData[0] - 1;
	const rightSteps = contractData[1] - 1;
	const steps = downSteps + rightSteps;
	const answer = nCk(steps, downSteps);
	//ns.tprint(answer);
	return answer;
}

export function uniquePathsGrid2(data, ns)
{
	const h = data.length;
	const w = data[0].length;
	const steps = h + w - 2;

	function isGoodRoute(routeNumber)
	{
		const routeString = routeNumber.toString(2).padStart(steps, "0");
		let pos_x = 0;
		let pos_y = 0;
		for(let i = 0 ; i < routeString.length ; i++)
		{
			//increment position
			if(routeString[i] == 0) pos_x++;
			else pos_y++;
			// do tests
			// out of bounds
			if(pos_x > w - 1) return false;
			if(pos_y > h - 1) return false;
			// check if grid[y][x] == 1
			if(data[pos_y][pos_x] == "1") return false;
		}
		return true;
	}

	let answer = 0;
	let options = Math.pow(2, steps);
	for(let i = 0 ; i < options ; i++)
	{
		if(isGoodRoute(i)) answer++;
	}
	//ns.tprint(answer);
	return answer;
}

export async function main(ns)
{
	ns.tprint(factorial(4));
	ns.tprint(nCk(8, 6));
}