/** @param {NS} ns **/
import {nukeAll, getExploits} from "/lib/nuke.js"
import {calcMaxThreads} from "/lib/alloc.js"
import {getRootServers} from "/lib/lib.js"
import {findScript} from "/lib/script.js"
import {buyExploits} from "/buy-exploits.js"


/*
// manually create programs to level up intelligence
BruteSSH.exe: 50
FTPCrack.exe: 100
relaySMTP.exe: 250
HTTPWorm.exe: 500
SQLInject.exe: 750
DeepscanV1.exe: 75
DeepscanV2.exe: 400
ServerProfiler.exe: 75
AutoLink.exe: 25
*/

const farmScript = "/farm/limited-basic.js"

async function waitForBachman(ns)
{
	await ns.sleep(10 * 1000);
	const factions = ns.checkFactionInvitations();
	for(const faction of factions) ns.joinFaction(faction)
}

function studyHacking(ns)
{
	const success = ns.universityCourse("rothman university", "study computer science", true);
	if(ns.getPlayer().factions.includes("Bachman & Associates")) ns.workForFaction("Bachman & Associates", "hacking contracts", true);
	if(!success) ns.toast("idle-study failed to study", "error");
	return success;
}

async function trainHacking(ns, goal)
{
	studyHacking(ns);
	while(ns.getHackingLevel() < goal)
	{
		await ns.sleep(1000);
	}
}

async function writeProgram(ns, program)
{
	if(ns.fileExists(program)) return;
	ns.createProgram(program, true);
	while(!ns.fileExists(program)) await ns.sleep(1000);
}


function stopFarmScripts(ns)
{
	//TODO: implement this correctly
	const scriptInfos = findScript(ns, farmScript);
	//ns.tprint(scriptInfos);
	for(const scriptInfo of scriptInfos) ns.kill(scriptInfo.procInfo.pid);
}

async function startFarmScripts(ns, target)
{
	nukeAll(ns);
	const hosts = getRootServers(ns);
	for(const host of hosts)
	{
		const threads = calcMaxThreads(ns, host, farmScript);
		if(threads >0)
		{
			if(host != "home") await ns.scp(farmScript, host);
			ns.exec(farmScript, host, threads, target, threads);
		}

	}
}

function getMyPID(ns)
{
	const host = ns.getHostname();
	const filename = ns.getScriptName();
	const args = ns.args;

	const procInfos = ns.ps(host);
	for(const proc of procInfos)
	{
		if(proc.filename == filename)
		if(proc.args.join("\n") == args.join("\n"))
			return proc.pid;
	}
	return null;
}


// kills all scripts on host except self
function kill_all(ns, host)
{
	const myPID = getMyPID(ns);
	const procs = ns.ps(host);
	for(const proc of procs)
	{
		if(proc.pid != myPID) ns.kill(proc.pid);
	}
}

export async function main(ns)
{
	await waitForBachman(ns);
	ns.disableLog("ALL");
	ns.enableLog("createProgram");
	ns.enableLog("exec");
	ns.enableLog("run");
	// phase 1
	// farm sigma-cosmetics
	//	get level 50 hacking
	//		study at uni
	//		basic farm on best host
	//	create BruteSSH.exe
	//buyExploits(ns);
	//await startFarmScripts(ns, "sigma-cosmetics");
	//ns.run("/farm/smart/smart-setup.js");
	//await trainHacking(ns, 50);

	// get all exploits, restart farm scripts each new exploit
	for(let i = 0 ; i <= 5 ; i++)
	{
		while(getExploits(ns).length < i)
		{
			await ns.sleep(1000);
			buyExploits(ns);
		}
		getRootServers(ns).forEach((host) => kill_all(ns, host));
		nukeAll(ns);
		ns.run("/farm/smart/smart-setup.js");
		await ns.sleep(50);
		ns.run("/tools/exec.js", 1, "all", "/daemon/security.js", "0");
	}
	// have all exploits - wait for security daemon to weaken unfarmed servers and add them to farm
	/*
	while(true)
	{
		await ns.sleep(10 * 1000);
		ns.run("/farm/smart/smart-setup.js");
		ns.run("do-contracts.js");
	}
	*/














	return;
	// below this -- bad
	getRootServers(ns).forEach((host) => kill_all(ns, host));
	const targets = getRootServers(ns).filter(server => server != "home" && server != "darkweb");
	const waitInfo = [];
	for(const target of targets)
	{
		const pid = ns.run("/farm/prepare/prepare.js", 1, target);
		waitInfo.push({pid: pid, target: target});
		await ns.sleep(250);
	}
	// wait for prep to finish, start new farms as available
	while(waitInfo.reduce((wait, info) => wait |= ns.isRunning(info.pid), false))
	{
		await ns.sleep(1000);
		ns.run("/farm/smart/smart-setup.js");
	}
	// start farm again

	//await writeProgram(ns, "BruteSSH.exe");
	
/*
	// phase 2
	// get 100 hacking
	// create FTPCrack.exe
	// redirect farm scripts to phantasy
	buyExploits(ns);
	await startFarmScripts(ns, "sigma-cosmetics");
	await trainHacking(ns, 100);
	//await writeProgram(ns, "FTPCrack.exe");
	await stopFarmScripts(ns);
	await startFarmScripts(ns, "phantasy");

	// phase 3
	// get 250 hacking
	// create HTTPWorm.exe
	buyExploits(ns);
	await startFarmScripts(ns, "sigma-phantasy");
	await trainHacking(ns, 250);
	//await writeProgram(ns, "relaySMTP.exe");
	buyExploits(ns);
	await startFarmScripts(ns, "phantasy");
	*/
	// phase 4
	// join faction
	// get rep
	// get augs
	// reset
}