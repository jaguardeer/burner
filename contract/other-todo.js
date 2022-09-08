/** @param {NS} ns **/


export function arrayJumpingGame(data, ns)
{
	//ns.tprint(data);
	let answer = true;
	for(let end = data.length - 1 ; end >= 1 ; end--)
	{
		let canConnect = false;
		for(let p = end - 1 ; p >= 0 ; p--)
		{
			if(data[p] >= end - p) canConnect = true;
		}
		//ns.tprint(canConnect);
		if(canConnect == false) answer = false;
	}
	//ns.tprint(answer);
	return answer ? 1 : 0;
}

export function generateIPAddresses(data, ns)
{
	function isValidIP(octets)
	{
		if(octets.length != 4) return false;
		for(let o of octets) if(Number(o) > 255) return false;
		for(let o of octets) if(o.length == 0) return false;
		for(let o of octets) if(o[0] == "0" && Number(o) > 0) return false;
		return true;
	}

	let answer = [];
	for(let i = 0 ; i < data.length - 2 ; i++)
	for(let j = i + 1 ; j < data.length - 1 ; j++)
	for(let k = j + 1 ; k < data.length ; k++)
	{
		let octets = Array(4);
		octets[0] = data.slice(0, i);
		octets[1] = data.slice(i, j);
		octets[2] = data.slice(j, k);
		octets[3] = data.slice(k);

		if(isValidIP(octets)) answer.push(octets.join("."));
	}
	return answer;
}

export function minPathSumTriangle(data, ns)
{
	const depth = data.length;
	let bestPath = Array(data.length);
	bestPath[0] = Array([data[0][0]]);
	for(let i = 1 ; i < depth ; i++)
	{
		bestPath[i] = Array(data[i].length);
		// left and right edge case
		bestPath[i][0] = Number(bestPath[i - 1][0]) + Number(data[i][0]);
		const last = bestPath[i].length - 1;
		bestPath[i][last] = Number(bestPath[i - 1][last - 1]) + Number(data[i][last]);
		// middle of layer has 2 options, choose best
		for(let j = 1 ; j < bestPath[i].length - 1 ; j++)
		{
			let prevBest = Math.min(bestPath[i - 1][j - 1], bestPath[i - 1][j]);
			bestPath[i][j] = Number(prevBest) + Number(data[i][j]);
		}
	}
	//ns.tprint(bestPath.join("\n"));
	//ns.tprint(answer);
	const answer = Math.min.apply(null, bestPath[depth - 1]);
	return answer;
}