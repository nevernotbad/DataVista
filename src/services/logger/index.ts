import { Logger } from './Logger';
export { Logger, LogLevel } from './Logger';
export function createLogger(module: string): Logger {
  return new Logger(module);
}
