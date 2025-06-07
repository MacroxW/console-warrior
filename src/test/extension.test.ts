import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

// Console Warrior Test Suite
suite('Console Warrior Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all Console Warrior tests.');

	suiteSetup(async () => {
		// Ensure extension is activated
		const extension = vscode.extensions.getExtension('macrox.console-warrior');
		if (extension && !extension.isActive) {
			await extension.activate();
		}
	});

	test('Extension should be present and activate', async () => {
		const extension = vscode.extensions.getExtension('macrox.console-warrior');
		assert.ok(extension);
		assert.ok(extension?.isActive);
	});

	test('Should register Console Warrior commands', async () => {
		const commands = await vscode.commands.getCommands(true);

		const expectedCommands = [
			'console-warrior.start',
			'console-warrior.pause',
			'console-warrior.showOutput',
			'console-warrior.clearOutput'
		];

		expectedCommands.forEach(command => {
			assert.ok(commands.includes(command), `Command ${command} should be registered`);
		});
	});

	test('Should have test project structure', () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		assert.ok(workspaceFolder, 'Workspace folder should exist');

		const testProjectPath = path.join(workspaceFolder.uri.fsPath, 'projects', 'test-node-project');
		assert.ok(fs.existsSync(testProjectPath), 'Test project directory should exist');

		const mainJsPath = path.join(testProjectPath, 'main.js');
		assert.ok(fs.existsSync(mainJsPath), 'main.js should exist in test project');

		const packageJsonPath = path.join(testProjectPath, 'package.json');
		assert.ok(fs.existsSync(packageJsonPath), 'package.json should exist in test project');
	});
	test('Should initialize LogManager correctly', async () => {
		// Import LogManager
		const { LogManager } = await import('../logManager.js');
		
		// Test initialization
		assert.doesNotThrow(() => {
			LogManager.initialize();
		}, 'LogManager should initialize without errors');
	});

	test('Should create status bar item', async () => {
		// Import StatusBarManager
		const statusBarModule = await import('../statusBar.js');
		
		// Test status bar creation
		assert.doesNotThrow(() => {
			const statusBar = new statusBarModule.StatusBarManager();
			statusBar.activate();
		}, 'StatusBarManager should initialize without errors');
	});

	test('Console Warrior start command should work', async () => {
		try {
			await vscode.commands.executeCommand('console-warrior.start');
			assert.ok(true, 'Start command executed successfully');
		} catch (error) {
			assert.fail(`Start command failed: ${error}`);
		}
	});

	test('Console Warrior pause command should work', async () => {
		try {
			await vscode.commands.executeCommand('console-warrior.pause');
			assert.ok(true, 'Pause command executed successfully');
		} catch (error) {
			assert.fail(`Pause command failed: ${error}`);
		}
	});

	test('Test project main.js should contain console.log statements', () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		assert.ok(workspaceFolder);

		const mainJsPath = path.join(workspaceFolder.uri.fsPath, 'projects', 'test-node-project', 'main.js');
		const content = fs.readFileSync(mainJsPath, 'utf8');

		assert.ok(content.includes('console.log'), 'main.js should contain console.log statements');
		assert.ok(content.includes('captureLog'), 'main.js should contain log capture functionality');
		assert.ok(content.includes('getCallerLineNumber'), 'main.js should contain line number detection');
	});
});
