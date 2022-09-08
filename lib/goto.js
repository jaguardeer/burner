/** @param {NS} ns **/

// wrapper for findPathRecurse.
// finds a path from root to target

export function findPath(ns, root, target)
{
	let path = [];
	const success = findPathRecurse(ns,"",root,target,path);
	if(success) return path;
	else return null;
}

// finds a path to target, starting from current
export function findPathRecurse(ns, prev, current, target, path)
{
	let connections = ns.scan(current);
	for(let next of connections)
	{
		if(next != current && next != prev)
		{
			if(next == target)
			{
				path.unshift(next);
				return true;
			}else{
				if(findPathRecurse(ns, current, next, target, path))
				{
					path.unshift(next);
					return true;
				}
			}
		}
	}
	return false;
}

export function goto(ns, target)
{
	let root = ns.getHostname();

	const path = findPath(ns, root, target);
	
	for(const next of path)	ns.connect(next);
}

export async function main(ns)
{

}