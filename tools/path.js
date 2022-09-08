export function autocomplete(data, args) {return [...data.servers];}

function doStuff(ns, hostname)
{
	let files = ns.ls(hostname,"cct");
	if(files != "")
	{
		ns.tprint(hostname + " : " + files);
	}
}

function recurse(ns, prev, current, depth, target, path)
{
	let connections = ns.scan(current);
	for(let next of connections)
	{
		if(next != current && next != prev)
		{
			if(next == target)
			{
				path.unshift("connect " + next);
				return true;
			}else{
				if(recurse(ns, current, next, depth+1, target, path))
				{
					path.unshift("connect " + next);
					return true;
				}
			}
		}
	}
	return false;
}

export async function main(ns)
{
	let root = ns.getHostname();
	let target = ns.args[0];
	let path = [];
	recurse(ns,"",root,1,target,path);
	ns.tprint(path.join(";"));
}