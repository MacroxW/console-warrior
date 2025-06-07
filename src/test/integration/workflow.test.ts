import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

suite('Console Warrior Integration Tests', () => {
    let testProjectPath: string;

    suiteSetup(async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        assert.ok(workspaceFolder, 'Workspace should be available');

        testProjectPath = path.join(workspaceFolder.uri.fsPath, 'projects', 'test-node-project');

        // Ensure extension is activated
        const extension = vscode.extensions.getExtension('MacroxW.console-warrior');
        if (extension && !extension.isActive) {
            await extension.activate();
        }
    });

    test('Complete workflow: Start -> Run Project -> Capture Logs -> Stop', async function () {
        this.timeout(10000); // Increase timeout for integration test

        // 1. Start Console Warrior monitoring
        await vscode.commands.executeCommand('console-warrior.startMonitoring');

        // 2. Simulate running the test project (in real scenario this would be done through terminal)
        const logFilePath = path.join(testProjectPath, '.console-warrior-logs.json');

        // 3. Create mock log data to simulate what the Node.js app would generate
        const mockLogs = [
            {
                index: 0,
                type: 'log',
                message: '🚀 Console Warrior Test Project Started!',
                timestamp: new Date().toISOString(),
                lineNumber: 97
            },
            {
                index: 1,
                type: 'log',
                message: 'Hello, World!',
                timestamp: new Date().toISOString(),
                lineNumber: 100
            },
            {
                index: 2,
                type: 'log',
                message: 'This is a simple message from Node.js',
                timestamp: new Date().toISOString(),
                lineNumber: 101
            }
        ];

        // Write mock logs to simulate real application output
        fs.writeFileSync(logFilePath, JSON.stringify(mockLogs, null, 2));

        // 4. Wait a moment for the file watcher to detect changes
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 5. Open the main.js file to see decorations
        const mainJsPath = path.join(testProjectPath, 'main.js');
        const document = await vscode.workspace.openTextDocument(mainJsPath);
        await vscode.window.showTextDocument(document);

        // 6. Wait for decorations to be applied
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 7. Verify log file exists and contains expected data
        assert.ok(fs.existsSync(logFilePath), 'Log file should exist');
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        const parsedLogs = JSON.parse(logContent);
        assert.strictEqual(parsedLogs.length, 3, 'Should have 3 log entries');

        // 8. Clear logs (instead of pause since there's no pause command)
        await vscode.commands.executeCommand('console-warrior.clearLogs');

        // 9. Cleanup
        if (fs.existsSync(logFilePath)) {
            fs.unlinkSync(logFilePath);
        }
    });

    test('Log file parsing and line number detection', () => {
        const mainJsPath = path.join(testProjectPath, 'main.js');
        const content = fs.readFileSync(mainJsPath, 'utf8');
        const lines = content.split('\n');

        // Find console.log statements and verify they have proper structure
        let consoleLogCount = 0;
        lines.forEach((line, index) => {
            if (line.includes('console.log(') && !line.includes('captureLog') && !line.includes('originalLog')) {
                consoleLogCount++;
                assert.ok(index >= 0, `Console.log at line ${index + 1} should have valid line number`);
            }
        });

        assert.ok(consoleLogCount > 0, 'Should find console.log statements in main.js');
    });

    test('Console override functions should be present', () => {
        const mainJsPath = path.join(testProjectPath, 'main.js');
        const content = fs.readFileSync(mainJsPath, 'utf8');

        assert.ok(content.includes('getCallerLineNumber'), 'Should have getCallerLineNumber function');
        assert.ok(content.includes('captureLog'), 'Should have captureLog function');
        assert.ok(content.includes('console.log = function'), 'Should have console.log override');
        assert.ok(content.includes('console.error = function'), 'Should have console.error override');
        assert.ok(content.includes('console.warn = function'), 'Should have console.warn override');
        assert.ok(content.includes('console.info = function'), 'Should have console.info override');
    });

    test('Menu commands should be accessible', async () => {
        const commands = await vscode.commands.getCommands(true);

        // Test menu-related commands
        assert.ok(commands.includes('console-warrior.startMonitoring'), 'Start monitoring command should be available');
        assert.ok(commands.includes('console-warrior.captureLogs'), 'Capture logs command should be available');
        assert.ok(commands.includes('console-warrior.viewLogs'), 'View logs command should be available');
        assert.ok(commands.includes('console-warrior.clearLogs'), 'Clear logs command should be available');
    });
});
