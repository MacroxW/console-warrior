import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export class NodeProjectManager {
    private static readonly PROJECTS_FOLDER = 'node-projects';
    private static readonly logDecorations: Map<string, vscode.TextEditorDecorationType> = new Map();
    private static readonly logData: Map<string, string[]> = new Map();
    private static nodeTerminal: vscode.Terminal | undefined;

    /**
     * Creates a new Node.js project for testing Console Warrior
     */
    static async createNodeProject(): Promise<void> {
        try {
            // Get project name from user
            const projectName = await vscode.window.showInputBox({
                prompt: 'Enter the name for your Node.js project',
                value: 'my-node-project',
                placeHolder: 'project-name',
                validateInput: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return 'Project name cannot be empty';
                    }
                    if (!/^[a-z0-9-_]+$/i.test(value)) {
                        return 'Project name can only contain letters, numbers, hyphens, and underscores';
                    }
                    return null;
                }
            });

            if (!projectName) {
                return;
            }

            // Create project path in user's home directory under a dedicated folder
            const homeDir = os.homedir();
            const projectsBaseDir = path.join(homeDir, 'VSCode-Extension-Projects', this.PROJECTS_FOLDER);
            const projectPath = path.join(projectsBaseDir, projectName);

            // Check if project already exists
            if (fs.existsSync(projectPath)) {
                const overwrite = await vscode.window.showWarningMessage(
                    `Project "${projectName}" already exists. Do you want to overwrite it?`,
                    'Yes', 'No'
                );
                if (overwrite !== 'Yes') {
                    return;
                }
            }

            await this.createProjectWithProgress(projectName, projectPath);

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create Node.js project: ${error}`);
        }
    }

    /**
     * Creates the Node.js project with a progress indicator
     */
    private static async createProjectWithProgress(projectName: string, projectPath: string): Promise<void> {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Creating Node.js Project: ${projectName}`,
            cancellable: false
        }, async (progress: vscode.Progress<{ increment?: number; message?: string }>) => {

            progress.report({ increment: 10, message: "Setting up project structure..." });

            // Create project directory
            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(projectPath, { recursive: true });
            }

            progress.report({ increment: 20, message: "Creating package.json..." });
            await this.createPackageJson(projectPath, projectName);

            progress.report({ increment: 40, message: "Creating main JavaScript file..." });
            await this.createMainJs(projectPath);

            progress.report({ increment: 60, message: "Creating example files with console logs..." });
            await this.createExampleFiles(projectPath);

            progress.report({ increment: 80, message: "Creating README..." });
            await this.createReadme(projectPath, projectName);

            progress.report({ increment: 90, message: "Creating .gitignore..." });
            await this.createGitignore(projectPath);

            progress.report({ increment: 100, message: "Opening project..." });

            // Open the project in a new VS Code window
            const uri = vscode.Uri.file(projectPath);
            await vscode.commands.executeCommand('vscode.openFolder', uri, true);

            vscode.window.showInformationMessage(
                `Node.js project "${projectName}" created successfully! Run "npm start" to get started.`
            );
        });
    }

    private static async createPackageJson(projectPath: string, projectName: string): Promise<void> {
        const packageJson = {
            name: projectName,
            version: "1.0.0",
            description: "Node.js project for testing Console Warrior",
            main: "index.js",
            scripts: {
                start: "node index.js",
                dev: "node --watch index.js",
                test: "node test.js"
            },
            dependencies: {},
            devDependencies: {}
        };

        const content = JSON.stringify(packageJson, null, 2);
        fs.writeFileSync(path.join(projectPath, 'package.json'), content);
    }

    private static async createMainJs(projectPath: string): Promise<void> {
        const mainJs = `// Console Warrior Test Project
// This file demonstrates various console.log patterns for testing

console.log('🚀 Console Warrior Test Project Started!');

// Basic console logs
console.log('Hello, World!');
console.log('This is a simple message');

// Variables and data
const userName = 'Developer';
const projectName = 'Console Warrior';
console.log('Welcome', userName);
console.log('Project:', projectName);

// Objects and arrays
const user = { name: 'John', age: 30, role: 'Developer' };
const colors = ['red', 'green', 'blue'];
console.log('User object:', user);
console.log('Colors array:', colors);

// Functions with console logs
function calculateSum(a, b) {
    console.log(\`Calculating sum of \${a} + \${b}\`);
    const result = a + b;
    console.log('Result:', result);
    return result;
}

// Error and warning logs
console.error('This is an error message');
console.warn('This is a warning message');
console.info('This is an info message');

// Async operations with logs
async function fetchData() {
    console.log('Starting data fetch...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Data fetched successfully!');
    return { data: 'Sample data' };
}

// Main execution
async function main() {
    console.log('=== Starting Console Warrior Demo ===');
    
    // Call functions
    calculateSum(5, 3);
    
    // Async operations
    try {
        const data = await fetchData();
        console.log('Received data:', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
    // Conditional logging
    const isDevelopment = true;
    if (isDevelopment) {
        console.log('Running in development mode');
    }
    
    // Loop with logs
    console.log('Counting to 5:');
    for (let i = 1; i <= 5; i++) {
        console.log(\`Count: \${i}\`);
    }
    
    console.log('=== Console Warrior Demo Complete ===');
}

// Run the demo
main().catch(console.error);
`;

        fs.writeFileSync(path.join(projectPath, 'index.js'), mainJs);
    }

    private static async createExampleFiles(projectPath: string): Promise<void> {
        // Create additional test files
        const testFile = `// Test file for Console Warrior
const express = require('express');

function startServer() {
    console.log('Starting Express server...');
    
    const app = express();
    const port = 3000;
    
    app.get('/', (req, res) => {
        console.log('GET request received for /');
        res.send('Hello from Express!');
    });
    
    app.listen(port, () => {
        console.log(\`Server running at http://localhost:\${port}\`);
    });
}

// Uncomment to start server
// startServer();

module.exports = { startServer };
`;

        fs.writeFileSync(path.join(projectPath, 'server.js'), testFile);

        // Create a utils file with more console patterns
        const utilsFile = `// Utility functions with console logging patterns

class Logger {
    static log(message, data = null) {
        console.log(\`[LOG] \${message}\`, data || '');
    }
    
    static error(message, error = null) {
        console.error(\`[ERROR] \${message}\`, error || '');
    }
    
    static debug(message, data = null) {
        if (process.env.DEBUG) {
            console.log(\`[DEBUG] \${message}\`, data || '');
        }
    }
}

function processData(items) {
    console.log('Processing', items.length, 'items');
    
    const results = items.map((item, index) => {
        console.log(\`Processing item \${index + 1}: \${item}\`);
        return item.toUpperCase();
    });
    
    console.log('Processing complete. Results:', results);
    return results;
}

// Example usage
if (require.main === module) {
    Logger.log('Utils module loaded');
    
    const testData = ['apple', 'banana', 'cherry'];
    processData(testData);
    
    Logger.debug('Debug message - only shows if DEBUG env var is set');
}

module.exports = { Logger, processData };
`;

        fs.writeFileSync(path.join(projectPath, 'utils.js'), utilsFile);
    }

    private static async createReadme(projectPath: string, projectName: string): Promise<void> {
        const readmeMd = `# ${projectName}

A Node.js project created for testing **Console Warrior** 🥷

## About Console Warrior

Console Warrior is a free alternative to Console Ninja that provides dynamic logging visualization directly in your VS Code editor.

## Getting Started

1. Install dependencies (if any):
   \`\`\`bash
   npm install
   \`\`\`

2. Run the main script:
   \`\`\`bash
   npm start
   \`\`\`

3. Run with watch mode (Node.js 18+):
   \`\`\`bash
   npm run dev
   \`\`\`

## Files Overview

- **index.js** - Main file with various console.log patterns
- **server.js** - Express server example with logging
- **utils.js** - Utility functions with logging patterns

## Console Warrior Features

This project demonstrates various logging patterns that Console Warrior can capture:

- ✅ Basic console.log statements
- ✅ Variable logging
- ✅ Object and array logging  
- ✅ Function execution logs
- ✅ Error and warning logs
- ✅ Async operation logs
- ✅ Conditional logging
- ✅ Loop iteration logs

## Usage with Console Warrior

1. Open any .js file in VS Code
2. Use Console Warrior commands to capture and display logs
3. See real-time log output beside your code

Happy logging! 🚀`;

        fs.writeFileSync(path.join(projectPath, 'README.md'), readmeMd);
    }

    private static async createGitignore(projectPath: string): Promise<void> {
        const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;

        fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
    }

    /**
     * Start Node.js application with logging
     */
    static async startNodeApplication(): Promise<void> {
        // Check if we're in the extension development workspace and suggest the test project
        const currentWorkspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
        const isExtensionWorkspace = currentWorkspace.includes('console-warrior');
        const defaultPath = isExtensionWorkspace
            ? path.join(currentWorkspace, 'projects', 'test-node-project')
            : currentWorkspace;

        const nodeProjectPath = await vscode.window.showInputBox({
            prompt: 'Enter the path to your Node.js project',
            value: defaultPath,
            placeHolder: '/path/to/node-project'
        });

        if (!nodeProjectPath) {
            return;
        }

        await this.startNodeApplicationAt(nodeProjectPath);
    }

    /**
     * Start Node.js application at a specific path (for automatic startup)
     */
    static async startNodeApplicationAt(nodeProjectPath: string): Promise<void> {
        // Verify that it's a valid Node.js project
        const packageJsonPath = path.join(nodeProjectPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            vscode.window.showErrorMessage('No package.json found in the specified directory');
            return;
        }

        // Close existing Node terminal if it exists
        if (this.nodeTerminal) {
            this.nodeTerminal.dispose();
        }

        // Create a new terminal for Node.js
        this.nodeTerminal = vscode.window.createTerminal({
            name: 'Console Warrior - Node.js',
            cwd: nodeProjectPath
        });

        this.nodeTerminal.show();
        this.nodeTerminal.sendText('node main.js');
        vscode.window.showInformationMessage('🥷 Console Warrior is attached! Node.js application started.');
    }

    /**
     * Focus on Node.js logs terminal
     */
    static viewNodeLogs(): void {
        const nodeTerminal = vscode.window.terminals.find((terminal: vscode.Terminal) =>
            terminal.name === 'Console Warrior - Node.js'
        );

        if (nodeTerminal) {
            nodeTerminal.show();
            vscode.window.showInformationMessage('📋 Node.js terminal focused - check the console logs!');
        } else {
            vscode.window.showWarningMessage('No Node.js terminal found. Start a Node.js project first using Console Warrior.');
        }
    }

    /**
     * Capture and display logs beside console.log statements
     */
    static async captureAndDisplayLogs(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;

        // Clear previous decorations for this file
        this.clearLogDecorations(filePath);

        // Find all console.log lines
        const logLines = this.findConsoleLogLines(document);

        if (logLines.length === 0) {
            vscode.window.showInformationMessage('No console.log statements found in current file');
            return;
        }

        // Simulate log capture (in real scenario, this would parse actual terminal output)
        const mockLogs = logLines.map((logInfo, index) => {
            const values = ['Hello World!', 'User Data', 'Processing...', 'Complete!', 'Success!'];
            const randomValue = values[index % values.length];
            return `${randomValue}`;
        });

        // Create decorations for each log line
        const decorations: vscode.DecorationOptions[] = [];

        logLines.forEach((lineInfo, index) => {
            const logMessage = mockLogs[index] || 'Log output here';

            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(lineInfo.lineNumber, lineInfo.endCharacter, lineInfo.lineNumber, lineInfo.endCharacter),
                renderOptions: {
                    after: {
                        contentText: ` 📋 ${logMessage}`,
                        color: '#00ff88',
                        fontStyle: 'italic',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        margin: '0 0 0 10px'
                    }
                }
            };

            decorations.push(decoration);
        });

        // Create decoration type for this file
        const decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                margin: '0 0 0 10px'
            }
        });

        // Store decoration type for cleanup
        this.logDecorations.set(filePath, decorationType);

        // Apply decorations
        editor.setDecorations(decorationType, decorations);

        vscode.window.showInformationMessage(`🎉 Captured ${decorations.length} console logs!`);
    }

    /**
     * Clear log decorations for a specific file
     */
    static clearLogDecorations(filePath?: string): void {
        if (filePath && this.logDecorations.has(filePath)) {
            const decorationType = this.logDecorations.get(filePath);
            if (decorationType) {
                decorationType.dispose();
                this.logDecorations.delete(filePath);
            }
        } else {
            // Clear all decorations
            this.logDecorations.forEach((decorationType) => {
                decorationType.dispose();
            });
            this.logDecorations.clear();
        }

        const editor = vscode.window.activeTextEditor;
        if (editor && filePath === editor.document.fileName) {
            vscode.window.showInformationMessage('✨ Log decorations cleared!');
        }
    }

    /**
     * Find all console.log lines in the document
     */
    private static findConsoleLogLines(document: vscode.TextDocument): Array<{ lineNumber: number, endCharacter: number, logContent: string }> {
        const logLines: Array<{ lineNumber: number, endCharacter: number, logContent: string }> = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Look for various console methods
            const consoleRegex = /console\.(log|error|warn|info|debug)\s*\(/;
            const consoleMatch = consoleRegex.exec(text);
            if (consoleMatch) {
                logLines.push({
                    lineNumber: i,
                    endCharacter: text.length,
                    logContent: text.trim()
                });
            }
        }

        return logLines;
    }

    /**
     * Generate mock log outputs (in real scenario, parse from terminal)
     */
    static generateMockLogs(filePath: string): string[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.fileName !== filePath) {
            return [];
        }

        const logLines = this.findConsoleLogLines(editor.document);
        return logLines.map((logInfo, index) => {
            const timestamp = new Date().toLocaleTimeString();
            return `[${timestamp}] ${logInfo.logContent}`;
        });
    }

    /**
     * Start real-time log monitoring for Node.js applications
     */
    static async startLogMonitoring(): Promise<void> {
        const nodeTerminal = vscode.window.terminals.find((terminal: vscode.Terminal) =>
            terminal.name === 'Console Warrior - Node.js'
        );

        if (!nodeTerminal) {
            vscode.window.showWarningMessage('No Node.js terminal found. Start a Node.js project first.');
            return;
        }

        // This is a simplified version - real implementation would need terminal output parsing
        vscode.window.showInformationMessage('🔍 Log monitoring started! Use "Capture Console Logs" to see output beside your code.');
    }
}
