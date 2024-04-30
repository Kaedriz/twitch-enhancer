import { copyContent, removeDirectory } from './files.ts';
import chalk from 'chalk';

export default class Bundler {
  public readonly entrypoints: string[];
  public readonly sourceDir: string;
  public readonly buildDir: string;

  constructor(entrypoints: string[], sourceDir: string, buildDir: string) {
    this.entrypoints = entrypoints;
    this.sourceDir = sourceDir;
    this.buildDir = buildDir;
  }

  async build(mode: Mode = 'production') {
    await Bun.build({
      entrypoints: this.entrypoints,
      outdir: this.buildDir,
      sourcemap: mode === 'production' ? 'none' : 'inline',
      define: {
        __bundle__: mode,
      },
    });
  }

  private async copyPublic() {
    copyContent('./public/', this.buildDir);
  }

  private async clearBuild() {
    await removeDirectory(this.buildDir);
  }

  async bundle(mode: Mode = 'production') {
    const now = Date.now();
    this.log(`Bundling extension...`);
    await this.clearBuild();
    await this.build(mode);
    await this.copyPublic();
    this.log(`Bundled in ${Date.now() - now}ms!`);
  }

  private log(...message: string[]) {
    console.info(chalk.cyan.bold('Build >'), chalk.white(...message));
  }
}

type Mode = 'production' | 'development';
