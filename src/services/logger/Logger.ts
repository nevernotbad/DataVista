export enum LogLevel { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }
export class Logger {
  private module: string;
  constructor(module: string) { this.module = module; }
  private format(level: string, msg: string): string {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
    return `[${ts}] [${level}] [${this.module}] ${msg}`;
  }
  debug(msg: string, ...args: unknown[]) { if (import.meta.env.DEV) console.debug(this.format('DEBUG', msg), ...args); }
  info(msg: string, ...args: unknown[]) { console.info(this.format('INFO', msg), ...args); }
  warn(msg: string, ...args: unknown[]) { console.warn(this.format('WARN', msg), ...args); }
  error(msg: string, ...args: unknown[]) { console.error(this.format('ERROR', msg), ...args); }
  remote(_msg: string) {}
}