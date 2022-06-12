import { LoggerFactory } from '../logger';

export function ClassLogger() {
  return (target: any) => {
    const logger = LoggerFactory.getLogger(target.name);
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(
        target.prototype,
        propertyName,
      );

      if (!descriptor) continue;

      const originalMethod = descriptor.value;

      const isMethod = originalMethod instanceof Function;

      if (!isMethod) continue;

      function getParamNames(func: any): string[] {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
        const ARGUMENT_NAMES = /([^\s,]+)/g;
        const fnStr: string = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr
          .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
          .match(ARGUMENT_NAMES);
        return result ?? [];
      }

      descriptor.value = function (...args: any[]) {
        const paramNames = getParamNames(originalMethod);
        const logMeta: Record<string, any> = {};
        for (let i = 0; i < paramNames.length; i++) {
          logMeta[paramNames[i]] = args[i];
        }
        const logMetaString = JSON.stringify(logMeta);

        const exitLog = () => {
          logger.log(`[${propertyName}] Completed with ${logMetaString}`);
        };

        const failLog = (error: unknown): Error => {
          logger.error(`[${propertyName}] Failed: ${error}, ${logMetaString}`);
          if (error instanceof Error) return error;
          return new Error(`${error}`);
        };

        try {
          logger.log(`[${propertyName}] Start with params: ${logMetaString}`);
          const result = originalMethod.apply(this, args);
          // support async functions.
          if (typeof result === 'object' && typeof result.then === 'function') {
            result.then(exitLog, failLog);
          } else {
            exitLog();
          }

          return result;
        } catch (error) {
          throw failLog(error);
        }
      };

      Object.defineProperty(target.prototype, propertyName, descriptor);
    }
  };
}
