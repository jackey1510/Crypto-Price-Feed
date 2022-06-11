import { ClassLogger } from '.';
import { LoggerFactory } from '../logger';

@ClassLogger()
class MockClass {
  mockFunc(arg1: string, arg2: number, _traceId?: string) {
    return arg1 + arg2;
  }

  async mockFunc2(arg1: string, arg2: number, _traceId?: string) {
    return arg1 + arg2;
  }

  failFunc(arg1: string) {
    arg1;
    throw new Error('Special error');
  }

  async failAsyncFunc(arg1: string) {
    arg1;
    throw new Error('Special error');
  }
}

const logger = LoggerFactory.getLogger(MockClass.name);

const mockObject = new MockClass();

describe('ClassLogger', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log').mockImplementation();
    jest.spyOn(logger, 'error').mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call logger.log with correct param', () => {
    const traceId = 'traceId';
    mockObject.mockFunc('1', 2, traceId);

    const logMeta = {
      arg1: '1',
      arg2: 2,
      _traceId: traceId,
    };
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toBeCalledWith(
      `[mockFunc] Start with params: `,
      JSON.stringify(logMeta),
    );
    expect(logger.log).toBeCalledWith(
      `[mockFunc] Completed with result: 12`,
      JSON.stringify(logMeta),
    );
  });

  it('should show log for async function', async () => {
    const traceId = 'traceId';
    await mockObject.mockFunc2('1', 2, traceId);
    expect(logger.log).toHaveBeenCalledTimes(2);
  });

  it('should show fail log for error', () => {
    expect(() => mockObject.failFunc('a')).toThrow();

    const logMeta = {
      arg1: 'a',
    };
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.log).toBeCalledWith(
      `[failFunc] Start with params: `,
      JSON.stringify(logMeta),
    );
    expect(logger.error).toBeCalledWith(
      `[failFunc] Failed: Error: Special error`,
      JSON.stringify(logMeta),
    );
  });

  it('should show fail log for async error', async () => {
    await expect(mockObject.failAsyncFunc('a')).rejects.toThrow();

    const logMeta = {
      arg1: 'a',
    };
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.log).toBeCalledWith(
      `[failAsyncFunc] Start with params: `,
      JSON.stringify(logMeta),
    );
    expect(logger.error).toBeCalledWith(
      `[failAsyncFunc] Failed: Error: Special error`,
      JSON.stringify(logMeta),
    );
  });
});
