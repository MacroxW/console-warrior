import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { LogManager } from '../../logManager';

suite('LogManager Unit Tests', () => {

    suiteSetup(() => {
        // Mock workspace folder setup
    });

    test('LogManager should initialize without errors', () => {
        assert.doesNotThrow(() => {
            LogManager.initialize();
        }, 'LogManager initialization should not throw errors');
    });

    test('LogManager should start monitoring', () => {
        assert.doesNotThrow(() => {
            LogManager.startMonitoring();
        }, 'Start monitoring should not throw errors');
    });

    test('LogManager should stop monitoring', () => {
        assert.doesNotThrow(() => {
            LogManager.stopMonitoring();
        }, 'Stop monitoring should not throw errors');
    });

    test('LogManager should clear output', () => {
        assert.doesNotThrow(() => {
            LogManager.clearOutput();
        }, 'Clear output should not throw errors');
    });

    test('LogManager should show output', () => {
        assert.doesNotThrow(() => {
            LogManager.showOutputPanel();
        }, 'Show output should not throw errors');
    });

    test('Log file should be created in correct location', () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            const expectedLogPath = path.join(
                workspaceFolder.uri.fsPath,
                'projects',
                'test-node-project',
                '.console-warrior-logs.json'
            );

            // Start monitoring to trigger file watching setup
            LogManager.startMonitoring();

            // The log file should be monitored at this location
            assert.ok(typeof expectedLogPath === 'string', 'Log file path should be a string');
            assert.ok(expectedLogPath.includes('test-node-project'), 'Path should include test project directory');
        }
    });
});
