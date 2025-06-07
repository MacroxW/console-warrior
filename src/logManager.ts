import * as vscode from 'vscode';
import * as path from 'path';
import { TerminalCapture } from './utils/terminalCapture';

interface LogEntry {
    index: number;
    type: string;
    message: string;
    timestamp: string;
    lineNumber: number | null;
}

export class LogManager {
    private static outputChannel: vscode.OutputChannel;
    private static decorationType: vscode.TextEditorDecorationType;
    private static isMonitoring: boolean = false;
    private static readonly logDecorations: Map<string, vscode.DecorationOptions[]> = new Map();
    private static realTimeLogs: LogEntry[] = [];
    private static fileWatcher: vscode.FileSystemWatcher | undefined;
    private static readonly documentChangeListener: vscode.Disposable[] = [];

    public static initialize(): void {
        this.outputChannel = vscode.window.createOutputChannel('Console Warrior');
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                margin: '0 0 0 20px',
                color: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                fontStyle: 'italic',
                border: '1px solid rgba(0, 255, 136, 0.3)'
            }
        });

        // Initialize terminal capture
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            TerminalCapture.initialize(workspaceFolder.uri.fsPath);
        }

        // Setup file watching for source code changes
        this.setupFileWatching();
        this.setupDocumentChangeListening();
    }

    public static startMonitoring(): void {
        this.isMonitoring = true;
        this.outputChannel.appendLine('🥷 Console Warrior monitoring started');
        console.log('[ConsoleWarrior] Monitoring started');
        this.startRealTimeCapture();
    }

    public static stopMonitoring(): void {
        this.isMonitoring = false;
        this.outputChannel.appendLine('⏸️ Console Warrior monitoring paused');
        console.log('[ConsoleWarrior] Monitoring paused');
        TerminalCapture.stopCapturing();
    }

    private static setupFileWatching(): void {
        // Watch for changes to JavaScript/TypeScript files that might affect log output
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return;
        }

        // Create file watcher for JS/TS files in the test project
        const pattern = new vscode.RelativePattern(workspaceFolder, '**/test-node-project/**/*.{js,ts}');
        this.fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);

        this.fileWatcher.onDidChange(uri => {
            if (this.isMonitoring) {
                console.log('[ConsoleWarrior] File changed:', uri.fsPath);
                this.outputChannel.appendLine(`📁 File changed: ${path.basename(uri.fsPath)}`);
                // Clear existing logs and decorations for the changed file
                this.clearDecorations(uri.fsPath);
                this.realTimeLogs = []; // Clear real-time logs to start fresh
                // Trigger decoration update after a brief delay to allow file to stabilize
                setTimeout(() => {
                    this.updateDecorations();
                }, 1000);
            }
        });

        this.fileWatcher.onDidCreate(uri => {
            if (this.isMonitoring) {
                console.log('[ConsoleWarrior] File created:', uri.fsPath);
                this.outputChannel.appendLine(`📁 File created: ${path.basename(uri.fsPath)}`);
            }
        });

        this.fileWatcher.onDidDelete(uri => {
            if (this.isMonitoring) {
                console.log('[ConsoleWarrior] File deleted:', uri.fsPath);
                this.outputChannel.appendLine(`📁 File deleted: ${path.basename(uri.fsPath)}`);
                this.clearDecorations(uri.fsPath);
            }
        });
    }

    private static setupDocumentChangeListening(): void {
        // Listen for document save events to refresh decorations
        const onDidSaveDocument = vscode.workspace.onDidSaveTextDocument(document => {
            if (this.isMonitoring && (document.fileName.endsWith('.js') || document.fileName.endsWith('.ts'))) {
                console.log('[ConsoleWarrior] Document saved:', document.fileName);
                this.outputChannel.appendLine(`💾 Document saved: ${path.basename(document.fileName)}`);
                // Clear logs for this file and refresh
                this.clearDecorations(document.fileName);
                setTimeout(() => {
                    this.updateDecorations();
                }, 500);
            }
        });

        // Listen for active editor changes to ensure decorations are shown
        const onDidChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
            if (this.isMonitoring && editor && (editor.document.fileName.endsWith('.js') || editor.document.fileName.endsWith('.ts'))) {
                console.log('[ConsoleWarrior] Active editor changed:', editor.document.fileName);
                // Apply existing decorations for this file
                const existingDecorations = this.logDecorations.get(editor.document.fileName);
                if (existingDecorations) {
                    editor.setDecorations(this.decorationType, existingDecorations);
                } else {
                    // Update decorations for the newly opened file
                    setTimeout(() => {
                        this.updateDecorations();
                    }, 300);
                }
            }
        });

        this.documentChangeListener.push(onDidSaveDocument, onDidChangeActiveEditor);
    }

    private static startRealTimeCapture(): void {
        this.realTimeLogs = [];
        console.log('[ConsoleWarrior] startRealTimeCapture called');
        // Start capturing real terminal output
        TerminalCapture.startCapturing((logEntries: LogEntry[]) => {
            console.log('[ConsoleWarrior] TerminalCapture callback', logEntries);
            // Process new log entries
            let newLogs = 0;
            logEntries.forEach(entry => {
                if (!this.realTimeLogs.some(e => e.timestamp === entry.timestamp && e.lineNumber === entry.lineNumber && e.message === entry.message)) {
                    this.realTimeLogs.push(entry);
                    this.outputChannel.appendLine(`📡 Captured: ${entry.message} (Line: ${entry.lineNumber})`);
                    newLogs++;
                }
            });
            if (newLogs > 0) {
                this.outputChannel.appendLine(`🟢 Actualizando decoraciones por ${newLogs} logs nuevos`);
                console.log(`[ConsoleWarrior] Actualizando decoraciones por ${newLogs} logs nuevos`);
                this.updateDecorations();
            } else {
                this.outputChannel.appendLine('🟡 No hay logs nuevos para decorar');
                console.log('[ConsoleWarrior] No hay logs nuevos para decorar');
            }
        });
        this.outputChannel.appendLine('📡 Real-time log capture started. Run "yarn dev" in the test project terminal to see logs.');
        vscode.window.showInformationMessage('🥷 Console Warrior is ready! Run "yarn dev" in the test project to see logs appear beside your code.');
        console.log('[ConsoleWarrior] Real-time log capture started');
    }

    private static updateDecorations(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this.isMonitoring) {
            this.outputChannel.appendLine('🔴 No active editor o monitoring desactivado');
            console.log('[ConsoleWarrior] No active editor o monitoring desactivado');
            return;
        }
        const document = editor.document;
        if (!document.fileName.endsWith('main.js')) {
            this.outputChannel.appendLine(`🟡 Archivo abierto no es main.js: ${document.fileName}`);
            console.log('[ConsoleWarrior] Archivo abierto no es main.js:', document.fileName);
            return;
        }

        // Agrupar logs por línea, si no hay lineNumber, usar la línea 0
        const logsByLine = new Map<number, LogEntry[]>();

        this.realTimeLogs.forEach(entry => {
            let lineIndex = 0;
            if (entry.lineNumber !== null && entry.lineNumber > 0) {
                lineIndex = entry.lineNumber - 1;
            }
            if (lineIndex < document.lineCount) {
                if (!logsByLine.has(lineIndex)) {
                    logsByLine.set(lineIndex, []);
                }
                logsByLine.get(lineIndex)!.push(entry);
            }
        });

        if (logsByLine.size === 0) {
            this.outputChannel.appendLine('🟡 No hay logs para decorar en main.js');
            console.log('[ConsoleWarrior] No hay logs para decorar en main.js');
            return;
        }

        const decorations: vscode.DecorationOptions[] = [];

        logsByLine.forEach((entries, lineIndex) => {
            const line = document.lineAt(lineIndex);
            // Combine multiple logs for the same line
            const messages = entries.map(entry => entry.message).join(' | ');
            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(
                    lineIndex,
                    line.text.length,
                    lineIndex,
                    line.text.length
                ),
                renderOptions: {
                    after: {
                        contentText: ` 🥷 ${messages}`,
                        color: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.5)',
                        fontWeight: 'bold',
                        margin: '0 0 0 15px'
                    }
                }
            };
            decorations.push(decoration);
        });

        // Store and apply decorations
        this.logDecorations.set(document.fileName, decorations);
        editor.setDecorations(this.decorationType, decorations);

        this.outputChannel.appendLine(`🎯 Applied ${decorations.length} real-time decorations to ${document.fileName}`);
        console.log(`[ConsoleWarrior] Applied ${decorations.length} real-time decorations to ${document.fileName}`);
    }

    public static showOutputPanel(): void {
        this.outputChannel.show();
    }

    public static clearOutput(): void {
        this.outputChannel.clear();
        this.clearAllDecorations();
    }

    public static async captureLogsInCurrentFile(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }

        const document = editor.document;

        // Check if it's a JavaScript or TypeScript file
        if (!document.fileName.endsWith('.js') && !document.fileName.endsWith('.ts')) {
            vscode.window.showInformationMessage('Console Warrior works with JavaScript and TypeScript files');
            return;
        }

        const logLines = this.findConsoleLogLines(document);

        if (logLines.length === 0) {
            this.outputChannel.appendLine(`No console.log statements found in ${document.fileName}`);
            vscode.window.showInformationMessage('No console.log statements found in current file');
            return;
        }

        // Show status message
        vscode.window.showInformationMessage(`🥷 Console Warrior found ${logLines.length} console logs! (Using MOCK data)`);

        // Simulate captured logs (in real implementation, parse from terminal/runtime)
        const decorations: vscode.DecorationOptions[] = [];

        logLines.forEach((logInfo, index) => {
            const logOutput = this.generateMockOutput(logInfo.content, index);

            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(
                    logInfo.lineNumber,
                    logInfo.endColumn,
                    logInfo.lineNumber,
                    logInfo.endColumn
                ),
                renderOptions: {
                    after: {
                        contentText: ` 📋 MOCK: ${logOutput}`,
                        color: '#ff8c00',
                        backgroundColor: 'rgba(255, 140, 0, 0.1)',
                        border: '1px solid rgba(255, 140, 0, 0.5)',
                        fontWeight: 'normal',
                        margin: '0 0 0 15px'
                    }
                }
            };

            decorations.push(decoration);
            this.outputChannel.appendLine(`Line ${logInfo.lineNumber + 1}: ${logOutput}`);
        });

        // Store and apply decorations
        this.logDecorations.set(document.fileName, decorations);
        editor.setDecorations(this.decorationType, decorations);

        this.outputChannel.appendLine(`🎉 Captured ${decorations.length} console logs in ${document.fileName}`);
    }

    private static findConsoleLogLines(document: vscode.TextDocument): Array<{
        lineNumber: number;
        endColumn: number;
        content: string;
    }> {
        const logLines: Array<{ lineNumber: number; endColumn: number; content: string }> = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            const consoleRegex = /console\.(log|error|warn|info|debug)\s*\(/;
            if (consoleRegex.test(text)) {
                logLines.push({
                    lineNumber: i,
                    endColumn: text.length,
                    content: text.trim()
                });
            }
        }

        return logLines;
    }

    private static generateMockOutput(logStatement: string, index: number): string {
        // Extract the content inside console.log()
        const consoleRegex = /console\.\w+\s*\(\s*([^)]+)\s*\)/;
        const match = consoleRegex.exec(logStatement);
        if (!match) {
            return 'undefined';
        }

        const content = match[1];

        // Generate realistic output based on content
        if (content.includes("'") || content.includes('"')) {
            // String literal
            return content.replace(/['"]/g, '');
        } else if (content.includes('{') || content.includes('[')) {
            // Object or array
            return content;
        } else if (content.includes('userName')) {
            return 'Developer';
        } else if (content.includes('projectName')) {
            return 'Console Warrior';
        } else if (content.includes('user')) {
            return '{ name: "John", age: 30, role: "Developer" }';
        } else if (content.includes('colors')) {
            return '["red", "green", "blue"]';
        } else {
            // Variable or expression
            const mockValues = ['Hello World!', 'Processing...', 'Complete!', 42, true];
            return String(mockValues[index % mockValues.length]);
        }
    }

    private static applyRealTimeLogs(logs: string[]): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const logLines = this.findConsoleLogLines(document);

        if (logLines.length === 0 || logs.length === 0) {
            return;
        }

        const decorations: vscode.DecorationOptions[] = [];

        logLines.forEach((logInfo, index) => {
            if (index < logs.length) {
                const realOutput = logs[index];

                const decoration: vscode.DecorationOptions = {
                    range: new vscode.Range(
                        logInfo.lineNumber,
                        logInfo.endColumn,
                        logInfo.lineNumber,
                        logInfo.endColumn
                    ), renderOptions: {
                        after: {
                            contentText: ` 🥷 ${realOutput}`,
                            color: '#00ff88',
                            backgroundColor: 'rgba(0, 255, 136, 0.1)',
                            border: '1px solid rgba(0, 255, 136, 0.5)',
                            fontWeight: 'bold',
                            margin: '0 0 0 15px'
                        }
                    }
                };

                decorations.push(decoration);
                this.outputChannel.appendLine(`Line ${logInfo.lineNumber + 1}: ${realOutput}`);
            }
        });

        // Store and apply decorations
        this.logDecorations.set(document.fileName, decorations);
        editor.setDecorations(this.decorationType, decorations);

        vscode.window.showInformationMessage(`🎉 Console Warrior captured ${decorations.length} real-time logs!`);
    }

    public static clearDecorations(fileName?: string): void {
        if (fileName && this.logDecorations.has(fileName)) {
            this.logDecorations.delete(fileName);
        } else {
            this.logDecorations.clear();
        }

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.setDecorations(this.decorationType, []);
        }
    }

    private static clearAllDecorations(): void {
        this.logDecorations.clear();
        vscode.window.visibleTextEditors.forEach(editor => {
            editor.setDecorations(this.decorationType, []);
        });
    }

    public static dispose(): void {
        this.outputChannel.dispose();
        this.decorationType.dispose();
        TerminalCapture.dispose();
        
        // Dispose file watcher
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
            this.fileWatcher = undefined;
        }
        
        // Dispose document change listeners
        this.documentChangeListener.forEach(listener => listener.dispose());
    }
}
