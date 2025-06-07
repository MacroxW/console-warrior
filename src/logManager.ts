import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
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
    private static hoverProvider: vscode.Disposable | undefined;

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
        this.setupHoverProvider();
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

    private static setupHoverProvider(): void {
        // Register hover provider for JavaScript and TypeScript files
        this.hoverProvider = vscode.languages.registerHoverProvider(
            [{ scheme: 'file', language: 'javascript' }, { scheme: 'file', language: 'typescript' }],
            {
                provideHover: (document, position) => {
                    if (!this.isMonitoring) {
                        return undefined;
                    }

                    // Check if this position is on a line with a console log decoration
                    const lineNumber = position.line;
                    const logEntriesForLine = this.realTimeLogs.filter(log =>
                        log.lineNumber === lineNumber + 1
                    );

                    if (logEntriesForLine.length === 0) {
                        return undefined;
                    }

                    // Create detailed hover content
                    const hoverContent = new vscode.MarkdownString();
                    hoverContent.isTrusted = true;
                    hoverContent.supportHtml = true;

                    hoverContent.appendMarkdown('## 🥷 Console Warrior Log Details\n\n');

                    logEntriesForLine.forEach((log, index) => {
                        if (index > 0) {
                            hoverContent.appendMarkdown('---\n\n');
                        }

                        hoverContent.appendMarkdown(`**Log #${log.index}** | **${log.type.toUpperCase()}** | \`${log.timestamp.split('T')[1].split('.')[0]}\`\n\n`);

                        // Enhanced message display with JSON preview
                        let displayMessage = log.message;
                        let jsonPreview = '';

                        try {
                            // Try to parse if message contains JSON-like content
                            if (log.message.includes('{') || log.message.includes('[')) {
                                const jsonRegex = /(\{.*\}|\[.*\])/;
                                const jsonMatch = jsonRegex.exec(log.message);
                                if (jsonMatch) {
                                    const possibleJson = jsonMatch[1];
                                    JSON.parse(possibleJson); // Validate JSON
                                    jsonPreview = '\n\n**JSON Preview:**\n';
                                    const formatted = JSON.stringify(JSON.parse(possibleJson), null, 2);
                                    jsonPreview += '```json\n' + formatted + '\n```\n';
                                }
                            }
                        } catch {
                            // Not valid JSON, continue with regular display
                        }

                        hoverContent.appendMarkdown(`**Message:** \`${displayMessage}\`${jsonPreview}\n`);
                    });

                    // Enhanced action buttons
                    const lineParam = encodeURIComponent(lineNumber.toString());
                    const copyUri = vscode.Uri.parse(`command:console-warrior.copyLogValue?${lineParam}`);
                    const detailsUri = vscode.Uri.parse(`command:console-warrior.showLogDetails?${lineParam}`);
                    const jsonUri = vscode.Uri.parse(`command:console-warrior.showLogJson`);

                    hoverContent.appendMarkdown('\n\n**Quick Actions:**\n\n');
                    hoverContent.appendMarkdown(`[📋 Copy Value](${copyUri}) | `);
                    hoverContent.appendMarkdown(`[🔍 View Details](${detailsUri}) | `);
                    hoverContent.appendMarkdown(`[📄 Full JSON](${jsonUri})`);

                    return new vscode.Hover(hoverContent);
                }
            }
        );
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
            const logCount = entries.length;
            const latestTimestamp = entries[entries.length - 1].timestamp;
            const timeDisplay = latestTimestamp.split('T')[1].split('.')[0];
            const countDisplay = logCount > 1 ? ` (${logCount} logs)` : '';

            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(
                    lineIndex,
                    line.text.length,
                    lineIndex,
                    line.text.length
                ),
                renderOptions: {
                    after: {
                        contentText: ` 🥷 ${messages}${countDisplay} [${timeDisplay}]`,
                        color: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.5)',
                        fontWeight: 'bold',
                        margin: '0 0 0 15px'
                    }
                },
                hoverMessage: new vscode.MarkdownString(`**🥷 Console Warrior Log**\n\n**Messages:** ${messages}\n\n**Count:** ${logCount}\n\n**Latest:** ${latestTimestamp}\n\n**💡 Quick Actions:**\n- **Ctrl+Shift+C** - Copy log value\n- **Ctrl+Shift+D** - Show details\n- **Ctrl+Shift+J** - View JSON file\n\n*Click or hover for more options*`)
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

    public static async showLogJson(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const logFilePath = path.join(
            workspaceFolder.uri.fsPath,
            'projects',
            'test-node-project',
            '.console-warrior-logs.json'
        );

        try {
            // Check if log file exists
            if (!fs.existsSync(logFilePath)) {
                vscode.window.showInformationMessage('🟡 No log file found. Run the test project to generate logs.');
                return;
            }

            // Read the log file content
            const content = fs.readFileSync(logFilePath, 'utf8');

            if (!content.trim()) {
                vscode.window.showInformationMessage('📄 Log file is empty. Run the test project to generate logs.');
                return;
            }

            // Parse and format JSON for better readability
            let formattedContent: string;
            try {
                const logs = JSON.parse(content);
                formattedContent = JSON.stringify(logs, null, 2);
            } catch (parseError) {
                // If parsing fails, show raw content
                console.warn('[ConsoleWarrior] Failed to parse log file as JSON:', parseError);
                formattedContent = content;
            }

            // Create a new document with the JSON content
            const document = await vscode.workspace.openTextDocument({
                content: formattedContent,
                language: 'json'
            });

            await vscode.window.showTextDocument(document, {
                viewColumn: vscode.ViewColumn.Beside,
                preview: false
            });

            vscode.window.showInformationMessage('📄 Console Warrior logs opened in JSON viewer');

        } catch (error) {
            vscode.window.showErrorMessage(`Error reading log file: ${error}`);
        }
    }

    public static async copyLogValue(lineNumber?: string): Promise<void> {
        try {
            const line = lineNumber ? parseInt(lineNumber) : vscode.window.activeTextEditor?.selection.active.line;
            if (line === undefined) {
                vscode.window.showWarningMessage('No line specified for copying log value');
                return;
            }

            const logEntriesForLine = this.realTimeLogs.filter(log =>
                log.lineNumber === line + 1
            );

            if (logEntriesForLine.length === 0) {
                vscode.window.showInformationMessage('No log data found for this line');
                return;
            }

            // If multiple logs on same line, copy the latest one
            const latestLog = logEntriesForLine[logEntriesForLine.length - 1];

            // Try to extract just the value (remove the prefix like "Received data:")
            let valueToCopy = latestLog.message;

            // Check if message contains JSON-like content
            if (latestLog.message.includes('{') || latestLog.message.includes('[')) {
                const jsonRegex = /(\{.*\}|\[.*\])/;
                const jsonMatch = jsonRegex.exec(latestLog.message);
                if (jsonMatch) {
                    try {
                        const jsonObj = JSON.parse(jsonMatch[1]);
                        valueToCopy = JSON.stringify(jsonObj, null, 2);
                    } catch {
                        // Keep original message if JSON parsing fails
                    }
                }
            }

            await vscode.env.clipboard.writeText(valueToCopy);
            vscode.window.showInformationMessage(`📋 Copied log value to clipboard: ${valueToCopy.substring(0, 50)}...`);

        } catch (error) {
            vscode.window.showErrorMessage(`Error copying log value: ${error}`);
        }
    }

    public static async showLogDetails(lineNumber?: string): Promise<void> {
        try {
            const line = lineNumber ? parseInt(lineNumber) : vscode.window.activeTextEditor?.selection.active.line;
            if (line === undefined) {
                vscode.window.showWarningMessage('No line specified for showing log details');
                return;
            }

            const logEntriesForLine = this.realTimeLogs.filter(log =>
                log.lineNumber === line + 1
            );

            if (logEntriesForLine.length === 0) {
                vscode.window.showInformationMessage('No log data found for this line');
                return;
            }

            // Create detailed view content
            let detailContent = '# 🥷 Console Warrior - Log Details\n\n';
            detailContent += `**Line:** ${line + 1}\n`;
            detailContent += `**Total Logs:** ${logEntriesForLine.length}\n\n`;
            detailContent += '---\n\n';

            logEntriesForLine.forEach((log, index) => {
                detailContent += `## Log Entry #${log.index}\n\n`;
                detailContent += `**Type:** ${log.type}\n`;
                detailContent += `**Timestamp:** ${log.timestamp}\n`;
                detailContent += `**Raw Message:** ${log.message}\n\n`;

                // Try to parse and format JSON content
                if (log.message.includes('{') || log.message.includes('[')) {
                    const jsonRegex = /(\{.*\}|\[.*\])/;
                    const jsonMatch = jsonRegex.exec(log.message);
                    if (jsonMatch) {
                        try {
                            const jsonObj = JSON.parse(jsonMatch[1]);
                            detailContent += '**Formatted JSON:**\n```json\n';
                            detailContent += JSON.stringify(jsonObj, null, 2);
                            detailContent += '\n```\n\n';
                        } catch {
                            detailContent += '**Note:** JSON parsing failed\n\n';
                        }
                    }
                }

                detailContent += '**Complete Log Object:**\n```json\n';
                detailContent += JSON.stringify(log, null, 2);
                detailContent += '\n```\n\n';

                if (index < logEntriesForLine.length - 1) {
                    detailContent += '---\n\n';
                }
            });

            // Create and show document
            const document = await vscode.workspace.openTextDocument({
                content: detailContent,
                language: 'markdown'
            });

            await vscode.window.showTextDocument(document, {
                viewColumn: vscode.ViewColumn.Beside,
                preview: false
            });

            vscode.window.showInformationMessage(`🔍 Showing details for ${logEntriesForLine.length} log(s) on line ${line + 1}`);

        } catch (error) {
            vscode.window.showErrorMessage(`Error showing log details: ${error}`);
        }
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

        // Dispose hover provider
        if (this.hoverProvider) {
            this.hoverProvider.dispose();
            this.hoverProvider = undefined;
        }
    }
}
