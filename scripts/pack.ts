import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";

const { spawn } = Bun;

const buildProc = spawn(["bun", "run", "build"], {
	stdout: "inherit",
	stderr: "inherit",
});
const buildStatus = await buildProc.exited;
if (buildStatus !== 0) {
	console.error("Build failed");
	process.exit(buildStatus);
}

const manifestRaw = await Bun.file("dist/manifest.json").text();
const manifest = JSON.parse(manifestRaw);
const version = manifest.version;

async function zipDir(dir: string, zipPath: string, exclude: Set<string> = new Set(), baseDir: string = dir) {
	const zip = new JSZip();
	async function addDir(currentDir: string, relDir: string) {
		const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
		for (const entry of entries) {
			if (exclude.has(entry.name)) continue;
			const fullPath = path.join(currentDir, entry.name);
			const relPath = relDir ? [relDir, entry.name].join("/") : entry.name;
			if (entry.isDirectory()) {
				await addDir(fullPath, relPath);
			} else if (entry.isFile()) {
				const fileData = await fs.promises.readFile(fullPath);
				zip.file(relPath, fileData);
			}
		}
	}
	await addDir(dir, "");
	const content = await zip.generateAsync({ type: "uint8array" });
	await Bun.write(zipPath, content);
}

const buildZipName = path.join("dist", `build-${version}.zip`);
await zipDir("dist", buildZipName);
console.log(`Created ${buildZipName}`);

const excludeDirs = new Set([
	".github",
	".husky",
	".idea",
	"dist",
	"node_modules",
	".git",
	path.basename(buildZipName),
]);

const sourceZipName = path.join("dist", `source-${version}.zip`);
await zipDir(".", sourceZipName, excludeDirs);
console.log(`Created ${sourceZipName}`);
