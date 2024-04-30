import fs from 'node:fs';
import { rimraf } from 'rimraf';

export function copyContent(source: string, target: string) {
  fs.cpSync(source, target, { recursive: true });
}

export async function removeDirectory(source: string) {
  await rimraf(source);
}
