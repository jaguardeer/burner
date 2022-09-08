/** @param {NS} ns **/
/*
Find All Valid Math Expressions
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


You are given the following string which contains only digits between 0 and 9:

448943089627

You are also given a target number of 22.
Return all possible ways you can add the +, -, and * operators to the string
such that it evaluates to the target number.

The provided answer should be an array of strings containing the valid expressions.
The data provided by this problem is an array with two elements.
The first element is the string of digits, while the second element is the target number:

["448943089627", 22]

NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

Input: digits = "123", target = 6
Output: [1+2+3, 1*2*3]

Input: digits = "105", target = 5
Output: [1*0+5, 10-5]
*/




export async function findValidMathExpressions(data, ns)
{
	const digits = data[0];
	const target = data[1];

	const operators = ["","+","-","*"];
	const answer = [];

	for(let i = 0 ; i < 4**(digits.length-1) ; i++)
	{
		const operatorString = i.toString(4).padStart(digits.length-1,"0").split("").map(c => operators[c]);
		const mathString = operatorString.flatMap((v,i) => [digits[i], v]).join("") + digits[digits.length - 1];
		try{
			const result = eval(mathString);
			//ns.tprint(result + " = " + mathString);
			if(result == target) answer.push(mathString);
		}
		catch{}
		//await ns.sleep(1000);
	}
	//ns.tprint(answer);
	return answer;
}

function findValues(leftValues, rightValues)
{
	let values = [];
	let opFuncs = {
		//"": ((a, b) => Number(String(a) + String(b))),
		"+": ((a, b) => a + b),
		"-": ((a, b) => a - b),
		//"*": ((a, b) => a * b)
	}

	for(const left of leftValues)
	{
		for(const right of rightValues)
		{
			for(const op in opFuncs)
			{
				//values.push(eval(`${left}${op}${right}`));
				values.push(opFuncs[op](left, right));
			}
		}
	}
	return values;
}

function another(ns, goal, digits, answers, index = 1, oldStr = digits[0])
{
	const newDigit = digits[index];
	const operators = (digits[index - 1] == "0") ? ["+", "-", "*"] : ["","+","-","*"];
	//ns.tprint("trying" + operators);
	for(const op of operators)
	{
		const newStr = oldStr + op + newDigit;
		//ns.tprint(newStr);
		if(index < digits.length - 1) another(ns, goal, digits, answers, index + 1, newStr);
		else if(eval(newStr) == goal) answers.push(newStr);
	}
}


function recurseExpression(data, ns)
{
	const digits = data[0];
	const target = data[1];

	const numDigits = digits.length;
	let possibleValues = {};

	for(let i = 0 ; i < numDigits ; i++)
	{
		let subDigits = digits[i];
		possibleValues[subDigits] = [Number(digits[i])];
	}
	//ns.tprint(possibleValues);
	
	for(let len = 2 ; len <= numDigits; len++)
	{
		for(let offset = 0 ; offset <= numDigits - len ; offset++)
		{
			const subDigits = digits.slice(offset, offset + len);
			possibleValues[subDigits] = subDigits[0] === "0" ? [] : [Number(subDigits)];
			for(let split = 1 ; split < subDigits.length ; split++)
			{
				const left = subDigits.slice(0, split);
				const right = subDigits.slice(split);
				const newValues = findValues(possibleValues[left], possibleValues[right]);
				ns.tprint(left + " " + right + " : " + newValues);
				possibleValues[subDigits] = possibleValues[subDigits].concat(newValues);
			}
			//possibleValues[subDigits] = findValues()
			//ns.tprint(subDigits);
		}
	}
	ns.tprint(possibleValues);
	return possibleValues[digits];
}

async function measure(ns, func, ...args)
{
	ns.tprint(`measuring ${func.name} with args = ${JSON.stringify(args)}`);
	const start = performance.now();
	const answer = await func(...args);
	const end = performance.now();
	ns.tprint(`${ns.nFormat(end - start, "0.00a")} ms`);// for answer: ${answer}`);
	return answer;
}

async function answerEqualsExpected(answer, expected)
{
	if(answer.length !== expected.length) return false;
	for(let i = 0 ; i < answer.length ; i++)
	{
		if(answer[i] !== expected[i]) return false;
	}
	return true;
}

export async function main(ns)
{
	//const data = ["123", 6]; //digits = "123", target = 6
	const data = ["448943089627", 22];
	//const data = ["448943089627", 22];
	const start = performance.now();
	const answer = await findValidMathExpressions(data, ns);
	//let answer = [];
	//await another(ns, data[1], data[0], answer);
	ns.tprint(`it took took ${performance.now() - start} ms`);
	//ns.tprint(answer);
	ns.tprint(answer.length);
	//ns.tprint(Object.values(answer).filter(x => x===22).length);
}