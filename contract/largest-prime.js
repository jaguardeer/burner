/** @param {NS} ns **/

export function largestPrimeFactor(num)
{
	let factors = [];
	let d = 2;
	while(num > 1)
	{
		while(num % d == 0)
		{
			factors.push(d);
			num /= d;
		}
		d += 1;
	}
	return Math.max(...factors);
}