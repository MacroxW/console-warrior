import * as vscode from 'vscode';
import { LogEntry, LogService } from '../services';

/**
 * Decoration styles for different log types
 */
const LOG_STYLES: Record<string, { color: string; icon: string }> = {
    log: { color: '#00ff88', icon: '📋' },
    info: { color: '#00bfff', icon: 'ℹ️' },
    warn: { color: '#ffcc00', icon: '⚠️' },
    error: { color: '#ff4444', icon: '❌' },
    debug: { color: '#888888', icon: '🔍' }
};

/**
 * DecorationProvider - Manages inline decorations for console logs
 */
export class DecorationProvider implements vscode.Disposable {
    private static instance: DecorationProvider;
    private decorationType: vscode.TextEditorDecorationType;
    private decorations: Map<string, vscode.DecorationOptions[]> = new Map();
    private readonly logService: LogService;

    private constructor() {
        this.logService = LogService.getInstance();
        this.decorationType = this.createDecorationType();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): DecorationProvider {
        if (!DecorationProvider.instance) {
            DecorationProvider.instance = new DecorationProvider();
        }
        return DecorationProvider.instance;
    }

    /**
     * Create the decoration type
     */
    private createDecorationType(): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType({
            after: {
                margin: '0 0 0 20px',
                fontStyle: 'italic'
            }
        });
    }

    /**
     * Update decorations for the active editor
     */
    public updateDecorations(editor?: vscode.TextEditor): void {
        const targetEditor = editor || vscode.window.activeTextEditor;
        if (!targetEditor) {
            return;
        }

        const document = targetEditor.document;
        const filePath = document.fileName;

        // Only process JS/TS files
        if (!this.isJavaScriptFile(filePath)) {
            return;
        }

        // Get logs for this file
        const logsByLine = this.logService.getLogsGroupedByLine(filePath);

        if (logsByLine.size === 0) {
            // Clear decorations if no logs
            targetEditor.setDecorations(this.decorationType, []);
            return;
        }

        const decorationOptions: vscode.DecorationOptions[] = [];

        logsByLine.forEach((logs, lineNumber) => {
            // Line numbers in logs are 1-based, VS Code is 0-based
            const lineIndex = lineNumber - 1;

            if (lineIndex < 0 || lineIndex >= document.lineCount) {
                return;
            }

            const line = document.lineAt(lineIndex);
            const decoration = this.createDecoration(line, logs);
            decorationOptions.push(decoration);
        });

        // Store and apply decorations
        this.decorations.set(filePath, decorationOptions);
        targetEditor.setDecorations(this.decorationType, decorationOptions);

        this.logService.log(`🎨 Applied ${decorationOptions.length} decorations to ${filePath}`);
    }

    /**
     * Create a decoration for a line with logs
     */
    private createDecoration(line: vscode.TextLine, logs: LogEntry[]): vscode.DecorationOptions {
        // Get the most recent log for display
        const latestLog = logs[logs.length - 1];
        const style = LOG_STYLES[latestLog.type] || LOG_STYLES.log;

        // Format message
        const message = this.formatMessage(logs);
        const timestamp = this.formatTimestamp(latestLog.timestamp);
        const countBadge = logs.length > 1 ? ` (${logs.length})` : '';

        return {
            range: new vscode.Range(
                line.lineNumber,
                line.text.length,
                line.lineNumber,
                line.text.length
            ),
            renderOptions: {
                after: {
                    contentText: ` ${style.icon} ${message}${countBadge} [${timestamp}]`,
                    color: style.color,
                    backgroundColor: `${style.color}15`,
                    border: `1px solid ${style.color}40`,
                    fontWeight: 'normal',
                    margin: '0 0 0 15px'
                }
            },
            hoverMessage: this.createHoverMessage(logs)
        };
    }

    /**
     * Format log message for display
     */
    private formatMessage(logs: LogEntry[]): string {
        if (logs.length === 1) {
            return this.truncateMessage(logs[0].message);
        }

        // Multiple logs - show latest
        return this.truncateMessage(logs[logs.length - 1].message);
    }

    /**
     * Truncate message if too long
     */
    private truncateMessage(message: string, maxLength: number = 50): string {
        if (message.length <= maxLength) {
            return message;
        }
        return message.substring(0, maxLength - 3) + '...';
    }

    /**
     * Format timestamp for display
     */
    private formatTimestamp(timestamp: string): string {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return '';
        }
    }

    /**
     * Create hover message with log details
     */
    private createHoverMessage(logs: LogEntry[]): vscode.MarkdownString {
        const hover = new vscode.MarkdownString();
        hover.isTrusted = true;
        hover.supportHtml = true;

        hover.appendMarkdown('## 🥷 Console Warrior\n\n');

        logs.forEach((log, index) => {
            if (index > 0) {
                hover.appendMarkdown('---\n\n');
            }

            const style = LOG_STYLES[log.type] || LOG_STYLES.log;
            hover.appendMarkdown(`**${style.icon} ${log.type.toUpperCase()}** | \`${this.formatTimestamp(log.timestamp)}\`\n\n`);
            
            // Format message with code block if it looks like JSON
            if (log.message.startsWith('{') || log.message.startsWith('[')) {
                try {
                    const formatted = JSON.stringify(JSON.parse(log.message), null, 2);
                    hover.appendMarkdown('```json\n' + formatted + '\n```\n\n');
                } catch {
                    hover.appendMarkdown('```\n' + log.message + '\n```\n\n');
                }
            } else {
                hover.appendMarkdown('```\n' + log.message + '\n```\n\n');
            }
        });

        return hover;
    }

    /**
     * Check if file is a JavaScript/TypeScript file
     */
    private isJavaScriptFile(filePath: string): boolean {
        return filePath.endsWith('.js') || 
               filePath.endsWith('.ts') || 
               filePath.endsWith('.jsx') || 
               filePath.endsWith('.tsx');
    }

    /**
     * Clear decorations for a specific file or all files
     */
    public clearDecorations(filePath?: string): void {
        if (filePath) {
            this.decorations.delete(filePath);
        } else {
            this.decorations.clear();
        }

        // Clear from active editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.setDecorations(this.decorationType, []);
        }

        this.logService.log('🧹 Decorations cleared');
    }

    /**
     * Refresh decorations for all visible editors
     */
    public refreshAll(): void {
        vscode.window.visibleTextEditors.forEach(editor => {
            this.updateDecorations(editor);
        });
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        this.decorationType.dispose();
        this.decorations.clear();
    }
}
