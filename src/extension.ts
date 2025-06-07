// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ViteProjectManager } from './commands/viteManager';

// Create a decoration type for text beside code
const decorationType = vscode.window.createTextEditorDecorationType({
	after: {
		contentText: ' // Your text here',
		color: '#888888',
		fontStyle: 'italic'
	}
});

// Function to open a specific welcome file
async function openWelcomeFile() {
	try {
		// Option 1: Open an existing file (change the path to the one you need)
		// const uri = vscode.Uri.file('/path/to/your/file.txt');
		// const document = await vscode.workspace.openTextDocument(uri);
		// await vscode.window.showTextDocument(document);

		// Option 2: Create a temporary file with welcome content
		const welcomeContent = `Welcome to your VS Code Extension!

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

Happy coding! 🚀`;

		const document = await vscode.workspace.openTextDocument({
			content: welcomeContent,
			language: 'markdown'
		});
		await vscode.window.showTextDocument(document);
		
		vscode.window.showInformationMessage('Extension activated! Welcome file opened.');
	} catch (error) {
		console.error('Error opening welcome file:', error);
	}
}

// This method is called when the extension is activated
// the extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// Open a specific file when activating the extension
	openWelcomeFile();

	// Command to add text beside the current line
	const addTextDisposable = vscode.commands.registerCommand('helloworld.addTextBeside', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		// Get the current cursor line
		const position = editor.selection.active;
		const line = position.line;
		const lineText = editor.document.lineAt(line);

		// Create the decoration at the end of the line
		const decoration = {
			range: new vscode.Range(line, lineText.text.length, line, lineText.text.length),
			renderOptions: {
				after: {
					contentText: ' ✨ Text added by extension!',
					color: '#00ff00',
					fontStyle: 'italic'
				}
			}
		};

		// Apply the decoration
		editor.setDecorations(decorationType, [decoration]);
		vscode.window.showInformationMessage('Text added beside code!');
	});

	// Command to clear decorations
	const clearTextDisposable = vscode.commands.registerCommand('helloworld.clearTextBeside', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			editor.setDecorations(decorationType, []);
			vscode.window.showInformationMessage('Text beside code cleared!');
		}
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('helloworld.helloWorld', async () => {
		// Create and open a Vite project using ViteProjectManager
		await ViteProjectManager.createViteProject();
	});

	// Command to start Vite dev server
	const startViteDisposable = vscode.commands.registerCommand('helloworld.startVite', async () => {
		await ViteProjectManager.startViteDevServer();
	});

	// Command to read Vite logs
	const readViteLogsDisposable = vscode.commands.registerCommand('helloworld.readViteLogs', () => {
		ViteProjectManager.readViteLogs();
	});

	// Command to capture and display logs
	const captureLogsDisposable = vscode.commands.registerCommand('helloworld.captureAndDisplayLogs', async () => {
		await ViteProjectManager.captureAndDisplayLogs();
	});

	// Command to clear log decorations
	const clearLogsDisposable = vscode.commands.registerCommand('helloworld.clearLogDecorations', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			ViteProjectManager.clearLogDecorations(editor.document.fileName);
		}
	});

	// Command to generate mock logs for testing
	const generateMockLogsDisposable = vscode.commands.registerCommand('helloworld.generateMockLogs', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			await ViteProjectManager.generateMockLogs(editor.document.fileName);
		}
	});

	context.subscriptions.push(
		disposable, 
		addTextDisposable, 
		clearTextDisposable, 
		startViteDisposable, 
		readViteLogsDisposable,
		captureLogsDisposable,
		clearLogsDisposable,
		generateMockLogsDisposable
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Cleanup code here if needed
}
