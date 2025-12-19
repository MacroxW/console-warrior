/**
 * Tests for Console Warrior Loader
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Import loader module
const loader = require('../index.js');

describe('Console Warrior Loader', () => {
    beforeEach(() => {
        // Reset logs before each test
        loader._reset();
    });

    describe('serialize()', () => {
        it('should serialize undefined', () => {
            assert.strictEqual(loader.serialize(undefined), 'undefined');
        });

        it('should serialize null', () => {
            assert.strictEqual(loader.serialize(null), 'null');
        });

        it('should serialize strings', () => {
            assert.strictEqual(loader.serialize('hello'), 'hello');
        });

        it('should serialize numbers', () => {
            assert.strictEqual(loader.serialize(42), '42');
            assert.strictEqual(loader.serialize(3.14), '3.14');
        });

        it('should serialize booleans', () => {
            assert.strictEqual(loader.serialize(true), 'true');
            assert.strictEqual(loader.serialize(false), 'false');
        });

        it('should serialize objects to JSON', () => {
            const obj = { name: 'test', value: 123 };
            assert.strictEqual(loader.serialize(obj), '{"name":"test","value":123}');
        });

        it('should serialize arrays to JSON', () => {
            const arr = [1, 2, 3];
            assert.strictEqual(loader.serialize(arr), '[1,2,3]');
        });

        it('should serialize functions', () => {
            function myFunc() {}
            assert.strictEqual(loader.serialize(myFunc), '[Function: myFunc]');
        });

        it('should serialize anonymous functions', () => {
            assert.strictEqual(loader.serialize(() => {}), '[Function: anonymous]');
        });

        it('should serialize symbols', () => {
            const sym = Symbol('test');
            assert.strictEqual(loader.serialize(sym), 'Symbol(test)');
        });

        it('should serialize errors', () => {
            const err = new Error('test error');
            assert.strictEqual(loader.serialize(err), 'Error: test error');
        });

        it('should handle circular references', () => {
            const obj = { name: 'circular' };
            obj.self = obj;
            assert.strictEqual(loader.serialize(obj), '[Circular or non-serializable object]');
        });
    });

    describe('console.log interception', () => {
        it('should capture console.log calls', () => {
            console.log('test message');
            const logs = loader._getLogs();
            
            assert.strictEqual(logs.length, 1);
            assert.strictEqual(logs[0].type, 'log');
            assert.strictEqual(logs[0].message, 'test message');
        });

        it('should capture console.error calls', () => {
            console.error('error message');
            const logs = loader._getLogs();
            
            assert.strictEqual(logs.length, 1);
            assert.strictEqual(logs[0].type, 'error');
            assert.strictEqual(logs[0].message, 'error message');
        });

        it('should capture console.warn calls', () => {
            console.warn('warning message');
            const logs = loader._getLogs();
            
            assert.strictEqual(logs.length, 1);
            assert.strictEqual(logs[0].type, 'warn');
            assert.strictEqual(logs[0].message, 'warning message');
        });

        it('should capture console.info calls', () => {
            console.info('info message');
            const logs = loader._getLogs();
            
            assert.strictEqual(logs.length, 1);
            assert.strictEqual(logs[0].type, 'info');
            assert.strictEqual(logs[0].message, 'info message');
        });

        it('should capture console.debug calls', () => {
            console.debug('debug message');
            const logs = loader._getLogs();
            
            assert.strictEqual(logs.length, 1);
            assert.strictEqual(logs[0].type, 'debug');
            assert.strictEqual(logs[0].message, 'debug message');
        });

        it('should capture multiple arguments', () => {
            console.log('hello', 'world', 123);
            const logs = loader._getLogs();
            
            assert.strictEqual(logs[0].message, 'hello world 123');
        });

        it('should capture objects', () => {
            console.log({ name: 'test' });
            const logs = loader._getLogs();
            
            assert.strictEqual(logs[0].message, '{"name":"test"}');
        });

        it('should include timestamp', () => {
            console.log('test');
            const logs = loader._getLogs();
            
            assert.ok(logs[0].timestamp);
            assert.ok(new Date(logs[0].timestamp).getTime() > 0);
        });

        it('should include line number', () => {
            console.log('test with line'); // This line number should be captured
            const logs = loader._getLogs();
            
            assert.ok(logs[0].line !== null);
            assert.ok(typeof logs[0].line === 'number');
        });

        it('should include file path', () => {
            console.log('test with file');
            const logs = loader._getLogs();
            
            assert.ok(logs[0].file !== null);
            assert.ok(logs[0].file.includes('loader.test.js'));
        });

        it('should increment index for each log', () => {
            console.log('first');
            console.log('second');
            console.log('third');
            const logs = loader._getLogs();
            
            assert.strictEqual(logs[0].index, 0);
            assert.strictEqual(logs[1].index, 1);
            assert.strictEqual(logs[2].index, 2);
        });
    });

    describe('log file', () => {
        it('should write logs to file', () => {
            console.log('file test');
            
            const fileContent = fs.readFileSync(loader.LOG_FILE, 'utf8');
            const fileLogs = JSON.parse(fileContent);
            
            assert.strictEqual(fileLogs.length, 1);
            assert.strictEqual(fileLogs[0].message, 'file test');
        });

        it('should create log directory if not exists', () => {
            assert.ok(fs.existsSync(loader.LOG_DIR));
        });
    });

    describe('_reset()', () => {
        it('should clear all logs', () => {
            console.log('before reset');
            assert.strictEqual(loader._getLogs().length, 1);
            
            loader._reset();
            
            assert.strictEqual(loader._getLogs().length, 0);
        });

        it('should reset index counter', () => {
            console.log('first');
            console.log('second');
            loader._reset();
            console.log('after reset');
            
            const logs = loader._getLogs();
            assert.strictEqual(logs[0].index, 0);
        });
    });
});
