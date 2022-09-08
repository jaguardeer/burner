/** @param {NS} ns **/

export function mergeOverlappingIntervals(data, ns)
{
	let intervals = data;
	intervals.sort((a,b) => a[0] > b[0] ? 1 : -1);

	function overlaps(a, b)
	{
		let low;
		let high;
		if(a[0] < b[0])
		{
			low = a;
			high = b;
		}else{
			low = b;
			high = a;
		}
		if(low[1] >= high[0]) return true;
		else return false;
	}

	let i = 0;
	while(i + 1 < intervals.length)
	{
		if(overlaps(intervals[i], intervals[i + 1]))
		{
			intervals[i][1] = Math.max(intervals[i][1], intervals[i + 1][1]);
			intervals.splice(i + 1, 1);
			//intervals.splice(i + 1, i + 1) // OLD
		}
		else i++;
	}
	return intervals;
}