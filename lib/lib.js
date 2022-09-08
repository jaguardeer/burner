/** @param {NS} ns **/

export function getRootServers(ns)
{
	return getAllServers(ns).filter(ns.hasRootAccess);
}

// TODO: use cache to save 200MB from scan()
export function getAllServers(ns)
{
	let world = [];
	function recurseServerConnections(ns, prev, current)
	{
		const connections = ns.scan(current);
		world.push(current);
		for(const next of connections)
		{
			if(next != current && next != prev)
			{
				recurseServerConnections(ns, current, next);
			}
		}
	}
	recurseServerConnections(ns, "", "home");
	return world;
}

export function error(ns, errorMsg)
{
	ns.toast(errorMsg, "error");
	ns.print("ERROR: " + errorMsg);
}

export function errorToast(ns, errorMsg)
{
	ns.toast(errorMsg, "error");
}

export function errorPrint(ns, errorMsg)
{
	ns.toast(errorMsg, "error");
	ns.tprint("ERROR: " + errorMsg);
}


// TAKES A 2D RECTANGULAR ARRAY
// GENERATES A STRING THAT WILL PRINT AS EVENLY SPACED COLUMNS
export function tableToString(inputTable)
{
	const table = inputTable.map(r => r.map(e => String(e)));
	const pad = 5;
	let widths = Array(table[0].length);
	for(let i = 0; i < widths.length; i++)
	{
		widths[i] = Math.max.apply(null, table.map(e => e[i].length));
	}
	const cols = widths.length;
	let output = [];
	for(let i = 0 ; i < table.length ; i++)
	{
		let row = [];
		for(let j = 0 ; j < cols ; j++)
		{
			const extra = widths[j] + pad - table[i][j].length;
			row.push(table[i][j] + Array(extra).join(" ") )
		}
		output.push(row.join(""));
	}
	return output.join("\n");
}


// PRINTS A TABLE USING tableToString()
export function printTable(ns, table)
{
	const output = tableToString(table);
	ns.tprint("\n" + output);
}


// TAKES AN ARRAY OF OBJECTS
// GENERATES A STRING THAT WILL PRINT AS EVENLY SPACED COLUMNS
export function objArrayToString(objArray, ns)
{
	const header = Object.keys(objArray[0]).map(k => String(k).toUpperCase());
	const rows = objArray.map(obj => Object.values(obj));
	const table = Array().concat([header], rows);
	return tableToString(table);
}

export function printObjArray(ns, objArray)
{
	const output = objArrayToString(objArray, ns);
	ns.tprint("\n" + output);
}