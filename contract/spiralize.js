/** @param {NS} ns **/
/*
Spiralize Matrix
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:

    [
        [40, 1,43,13,33]
        [22,49, 5,34,17]
        [35,20,38,40, 2]
        [38, 9, 8,48,19]
    ]

Here is an example of what spiral order should be:

    [
        [1, 2, 3]
        [4, 5, 6]
        [7, 8, 9]
    ]

Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

Note that the matrix will not always be square:

    [
        [1,  2,  3,  4]
        [5,  6,  7,  8]
        [9, 10, 11, 12]
    ]

Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
*/


export async function spiralizeMatrix(data, ns)
{
	// const bounds
	const matrixHeight = data.length;
	const matrixWidth = data[0].length;
	// const directions
	const dirRight = {x:  1, y:  0};
	const dirDown  = {x:  0, y:  1};
	const dirLeft  = {x: -1, y:  0};
	const dirUp    = {x:  0, y: -1};
	// initial values
	let bounds = {left: 0, right: matrixWidth - 1, top: 0, bottom: matrixHeight - 1};
	let pos = {x: bounds.left + 1, y: bounds.top};
	let dir = dirRight;
	let answer = [data[0][0]];
	// spiralize
	while(answer.length < matrixWidth * matrixHeight)
	{
		/*
		ns.tprint(pos.x + "," + pos.y + "\t\t"
				+ dir.x + "," + dir.y + "\t\t"
				+ bounds.left + "," + bounds.right + "," + bounds.top + "," + bounds.bottom + "\t\t"
				+ data[pos.y][pos.x]);
		*/
		// add current position to answer[]
		answer.push(data[pos.y][pos.x]);
		// if at corner, change direction and decrease rect side length
		if(pos.x == bounds.left && pos.y == bounds.top && dir == dirUp)		// top left
		{
			//ns.tprint("topleft");
			bounds.left++;
			dir = dirRight;
		}
		else if(pos.x == bounds.right && pos.y == bounds.top && dir == dirRight)	// top right
		{
			//ns.tprint("topright");
			bounds.top++;
			dir = dirDown;
		}
		else if(pos.x == bounds.right && pos.y == bounds.bottom && dir == dirDown)	// bottom right
		{
			//ns.tprint("botright");
			bounds.right--;
			dir = dirLeft;
		}
		else if(pos.x == bounds.left && pos.y == bounds.bottom && dir == dirLeft)	// bottom left
		{
			//ns.tprint("botleft");
			bounds.bottom--;
			dir = dirUp;
		}
		// increment pointer position
		pos.x += dir.x;
		pos.y += dir.y;
	}

	//ns.tprint(answer);
	return answer;
}