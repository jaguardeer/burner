/** @param {NS} ns **/

import {nukeAll} from "/lib/nuke.js"

function tryStudy(ns)
{
	const success = ns.universityCourse("rothman university", "study computer science", false);
	if(!success) ns.toast("idle-study failed to study", "error");
	return success;
}

export async function main(ns)
{
	const dir = "/post-augment/";
	ns.run(dir+"gen-cache.js");
	ns.run("do-contract.js");
	// find best farm target. or just farm xp
	ns.run("mastermind.js");
	//ns.run("/tools/exec.js", 1, "home", "loop-weak.js", 0, "n00dles");
	//ns.run("/tools/exec.js", 1, "all", "loop-weak.js", 0, "n00dles");
}