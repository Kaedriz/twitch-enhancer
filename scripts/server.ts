import chalk from 'chalk';
import chokidar from 'chokidar';
import { ServerHelper } from './helper.ts';
import serveStatic from 'serve-static-bun';
import Bundler from './bundler.ts';

export default class BundlerServer {
  private readonly bundler: Bundler;
  private readonly port: number;

  constructor(port: number, bundler: Bundler) {
    this.port = port;
    this.bundler = bundler;
  }

  async watch() {
    const watcher = chokidar.watch(this.bundler.sourceDir, {
      ignoreInitial: true,
    });
    watcher.on('all', async (eventName, path) => await this.handleUpdate(eventName, path));
  }

  private async handleUpdate(eventName: string, path: string) {
    const now = Date.now();
    await this.bundler.build('development');
    console.info(ServerHelper.getSymbol(eventName), chalk.white(path), chalk.gray.bold(Date.now() - now + 'ms'));
  }

  async serve() {
    await this.bundler.bundle('development');
    await this.watch();
    Bun.serve({
      fetch: serveStatic(this.bundler.buildDir),
      port: this.port,
    });
    this.log('Server has started.');
    this.log('Listening at:', chalk.magentaBright('http://localhost:' + this.port));
  }

  private log(...message: string[]) {
    console.info(chalk.greenBright.bold('Server >'), chalk.white(...message));
  }
}
