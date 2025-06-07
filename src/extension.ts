// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import { NodeProjectManager } from './commands/nodeManager';
import { LogManager } from './logManager';
import { MenuManager } from './menus/menuManager';
import { StatusBarManager } from './statusBar';

// Function to open a specific welcome file
async function openWelcomeFile() {
	try {
		// Option 1: Open an existing file (change the path to the one you need)
		// const uri = vscode.Uri.file('/path/to/your/file.txt');
		// const document = await vscode.workspace.openTextDocument(uri);
		// await vscode.window.showTextDocument(document);

		// Option 2: Create a temporary file with welcome content
		const welcomeContent = `# Welcome to your VS Code Extension

This extension allows you to:

- Add text beside your code lines
- Clear decorations when you don't need them
- Create and manage Vite projects

Available commands:

- Ctrl+Shift+P -> "Hello World" (Create Vite Project)
- Ctrl+Shift+P -> "Add Text Beside Code"
- Ctrl+Shift+P -> "Clear Text Beside Code"
- Ctrl+Shift+P -> "Start Vite Dev Server"
- Ctrl+Shift+P -> "Read Vite Logs"

Happy coding! 🚀
`;

		const document = await vscode.workspace.openTextDocument({
			content: welcomeContent,
			language: 'markdown'
		});
		await vscode.window.showTextDocument(document);

		vscode.window.showInformationMessage('Extension activated! Welcome file opened.');
	} catch (error) {
		vscode.window.showErrorMessage(`Error opening welcome file: ${error}`);
	}
}

// Function to open the test project and start Node.js
async function openTestProjectAndStartNode() {
	try {
		// Get the workspace folder path
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			throw new Error('No workspace folder found');
		}

		// Debug: Check what workspace we're in
		const workspacePath = workspaceFolder.uri.fsPath;

		// Check if we're in the main console-warrior directory or a subdirectory
		let consoleWarriorPath: string;
		if (workspacePath.includes('console-warrior') && workspacePath.endsWith('console-warrior')) {
			// We're in the main console-warrior directory
			consoleWarriorPath = workspacePath;
		} else if (workspacePath.includes('console-warrior')) {
			// We're in a subdirectory, find the console-warrior root
			const parts = workspacePath.split(path.sep);
			const consoleWarriorIndex = parts.indexOf('console-warrior');
			if (consoleWarriorIndex !== -1) {
				consoleWarriorPath = parts.slice(0, consoleWarriorIndex + 1).join(path.sep);
			} else {
				throw new Error('Could not find console-warrior root directory');
			}
		} else {
			throw new Error('Not in a console-warrior workspace');
		}

		// Construct the path to main.js
		const mainJsAbsolutePath = path.join(consoleWarriorPath, 'projects', 'test-node-project', 'main.js');
		const mainJsUri = vscode.Uri.file(mainJsAbsolutePath);

		// Verify the file exists before trying to open it
		try {
			await vscode.workspace.fs.stat(mainJsUri);
		} catch {
			throw new Error(`Main.js file not found at: ${mainJsAbsolutePath}`);
		}

		// Open main.js file
		const document = await vscode.workspace.openTextDocument(mainJsUri);
		await vscode.window.showTextDocument(document);

		// Wait a moment for the UI to settle
		await new Promise<void>(resolve => {
			(globalThis as any).setTimeout(() => {
				resolve();
			}, 1000);
		});

		// Start Node.js application automatically (for test project)
		const testProjectPath = path.join(consoleWarriorPath, 'projects', 'test-node-project');
		await NodeProjectManager.startNodeApplicationAt(testProjectPath);

		vscode.window.showInformationMessage('🥷 Console Warrior is attached! Test project opened and Node.js started. Starting monitoring...');
	} catch (error) {
		vscode.window.showErrorMessage(`Error opening test project: ${error}`);
		// Fallback to welcome file if main.js cannot be opened
		await openWelcomeFile();
	}
}

// Global instances
let statusBarManager: StatusBarManager;

// This method is called when the extension is activated
// the extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	vscode.window.showInformationMessage('🥷 Console Warrior extension is now active!');

	// Initialize modules
	LogManager.initialize();
	statusBarManager = new StatusBarManager();
	MenuManager.initialize(statusBarManager);

	// Activate status bar
	statusBarManager.activate();

	// Open test project and start Node.js when activating the extension (in development mode)
	// Add a slight delay to ensure VS Code is fully loaded
	setTimeout(async () => {
		await openTestProjectAndStartNode();
		// Auto-start Console Warrior monitoring after opening the project
		setTimeout(() => {
			statusBarManager.start();
		}, 2000);
	}, 1000);

	// Console Warrior Commands

	// Command to create a new Node.js project
	const createProjectDisposable = vscode.commands.registerCommand('console-warrior.createProject', async () => {
		await NodeProjectManager.createNodeProject();
	});

	// Command to start Node.js application
	const startNodeDisposable = vscode.commands.registerCommand('console-warrior.startNode', async () => {
		await NodeProjectManager.startNodeApplication();
	});

	// Command to view Node.js logs
	const viewLogsDisposable = vscode.commands.registerCommand('console-warrior.viewLogs', () => {
		NodeProjectManager.viewNodeLogs();
	});

	// Command to capture and display logs
	const captureLogsDisposable = vscode.commands.registerCommand('console-warrior.captureLogs', async () => {
		await LogManager.captureLogsInCurrentFile();
	});

	// Command to clear log decorations
	const clearLogsDisposable = vscode.commands.registerCommand('console-warrior.clearLogs', () => {
		LogManager.clearDecorations();
	});

	// Command to start log monitoring
	const startMonitoringDisposable = vscode.commands.registerCommand('console-warrior.startMonitoring', async () => {
		LogManager.startMonitoring();
	});

	// Command to stop log monitoring
	const stopMonitoringDisposable = vscode.commands.registerCommand('console-warrior.stopMonitoring', async () => {
		LogManager.stopMonitoring();
	});

	// Status bar menu command
	const statusBarMenuDisposable = vscode.commands.registerCommand('console-warrior.statusBarMenu', async () => {
		await MenuManager.showStatusBarMenu();
	});

	// Project menu command
	const projectMenuDisposable = vscode.commands.registerCommand('console-warrior.projectMenu', async () => {
		await MenuManager.showProjectMenu();
	});

	// Test command to manually show decorations
	const testDecorationsDisposable = vscode.commands.registerCommand('console-warrior.testDecorations', async () => {
		vscode.window.showInformationMessage('🥷 Testing Console Warrior decorations...');
		await LogManager.captureLogsInCurrentFile();
	});

	// Auto-capture logs when opening JavaScript/TypeScript files
	const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(async (document) => {
		if ((document.fileName.endsWith('.js') || document.fileName.endsWith('.ts')) && statusBarManager) {
			// Wait a moment for the document to be fully loaded
			setTimeout(async () => {
				await LogManager.captureLogsInCurrentFile();
			}, 500);
		}
	});

	// Auto-capture logs when switching between files
	const onDidChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		if (editor && (editor.document.fileName.endsWith('.js') || editor.document.fileName.endsWith('.ts')) && statusBarManager) {
			// Wait a moment for the editor to be fully loaded
			setTimeout(async () => {
				await LogManager.captureLogsInCurrentFile();
			}, 500);
		}
	});

	context.subscriptions.push(
		createProjectDisposable,
		startNodeDisposable,
		viewLogsDisposable,
		captureLogsDisposable,
		clearLogsDisposable,
		startMonitoringDisposable,
		stopMonitoringDisposable,
		statusBarMenuDisposable,
		projectMenuDisposable,
		testDecorationsDisposable,
		statusBarManager,
		onDidOpenTextDocument,
		onDidChangeActiveEditor
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Cleanup code here if needed
	LogManager.dispose();
	if (statusBarManager) {
		statusBarManager.dispose();
	}
}
