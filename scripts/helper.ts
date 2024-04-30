import chalk from 'chalk';

const symbols: Record<string, string> = {
  add: chalk.greenBright('+'),
  change: chalk.yellowBright('*'),
  unlink: chalk.redBright('-'),
};

export const ServerHelper = {
  getSymbol(event: string) {
    const symbol = symbols[event.replace('Dir', '')] ?? chalk.magenta('?');
    return chalk.white('[') + symbol + chalk.white(']');
  },
};
