
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WRN',
  ERROR = 'ERR',
  GEMINI = 'GEMINI'
}

export const formatLog = (level: LogLevel, message: string): string => {
  return `${level}: ${message}`;
};

export const sysLog = (message: string) => formatLog(LogLevel.INFO, message);
export const sysWarn = (message: string) => formatLog(LogLevel.WARN, message);
export const sysError = (message: string) => formatLog(LogLevel.ERROR, message);
