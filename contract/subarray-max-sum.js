/** @param {NS} ns **/

export function subarrayWithMaximumSum(data, ns)
{
	let bestSum = null;
	for(let size = 1 ; size <= data.length ; size++)
	{
		for(let i = 0 ; i <= data.length - size ; i++)
		{
			let sum = data.slice(i, i + size).reduce((a,b) => a + b);
			if(sum > bestSum) bestSum = sum;
		}
	}
	return bestSum;
}