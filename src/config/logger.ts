export interface LogPayload {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
  timestamp?: string;
}

export class StructuredLogger {
  public static log(payload: LogPayload): void {
    const formatted = {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
      service: 'enterprise-backend'
    };

    const serialized = JSON.stringify(formatted);

    if (payload.level === 'error') {
      console.error(serialized);
    } else if (payload.level === 'warn') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }

  public static info(message: string, context?: Record<string, unknown>): void {
    this.log({ level: 'info', message, context });
  }

  public static error(message: string, context?: Record<string, unknown>): void {
    this.log({ level: 'error', message, context });
  }
}
