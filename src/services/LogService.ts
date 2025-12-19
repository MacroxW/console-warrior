import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Log entry structure from the loader
 */
export interface LogEntry {
    index: number;
    type: 'log' | 'error' | 'warn' | 'info' | 'debug';
    message: string;
    timestamp: string;
    file: string | null;
    line: number | null;
}

/**
 * LogService - Manages log data and provides access to captured logs
 */
export class LogService {
    private static instance: LogService;
    private logs: LogEntry[] = [];
    private readonly logFilePath: string;
    private outputChannel: vscode.OutputChannel;

    private constructor() {
        this.logFilePath = path.join(os.homedir(), '.console-warrior', 'logs.json');
        this.outputChannel = vscode.window.createOutputChannel('Console Warrior');
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): LogService {
        if (!LogService.instance) {
            LogService.instance = new LogService();
        }
        return LogService.instance;
    }

    /**
     * Get the path to the log file
     */
    public getLogFilePath(): string {
        return this.logFilePath;
    }

    /**
     * Read logs from the log file
     */
    public readLogs(): LogEntry[] {
        try {
            if (!fs.existsSync(this.logFilePath)) {
                return [];
            }

            const content = fs.readFileSync(this.logFilePath, 'utf8');
            if (!content.trim()) {
                return [];
            }

            this.logs = JSON.parse(content);
            return this.logs;
        } catch (error) {
            this.outputChannel.appendLine(`Error reading logs: ${error}`);
            return [];
        }
    }

    /**
     * Get logs for a specific file
     */
    public getLogsForFile(filePath: string): LogEntry[] {
        const logs = this.readLogs();
        const normalizedPath = this.normalizePath(filePath);
        
        return logs.filter(log => {
            if (!log.file) return false;
            return this.normalizePath(log.file) === normalizedPath;
        });
    }

    /**
     * Get logs grouped by line number for a specific file
     */
    public getLogsGroupedByLine(filePath: string): Map<number, LogEntry[]> {
        const logs = this.getLogsForFile(filePath);
        const grouped = new Map<number, LogEntry[]>();

        logs.forEach(log => {
            if (log.line !== null) {
                const existing = grouped.get(log.line) || [];
                existing.push(log);
                grouped.set(log.line, existing);
            }
        });

        return grouped;
    }

    /**
     * Clear all logs
     */
    public clearLogs(): void {
        try {
            if (fs.existsSync(this.logFilePath)) {
                fs.writeFileSync(this.logFilePath, '[]');
            }
            this.logs = [];
            this.outputChannel.appendLine('Logs cleared');
        } catch (error) {
            this.outputChannel.appendLine(`Error clearing logs: ${error}`);
        }
    }

    /**
     * Get the output channel for logging
     */
    public getOutputChannel(): vscode.OutputChannel {
        return this.outputChannel;
    }

    /**
     * Show the output channel
     */
    public showOutput(): void {
        this.outputChannel.show();
    }

    /**
     * Log a message to the output channel
     */
    public log(message: string): void {
        this.outputChannel.appendLine(message);
    }

    /**
     * Normalize file path for comparison
     */
    private normalizePath(filePath: string): string {
        return path.normalize(filePath).toLowerCase();
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        this.outputChannel.dispose();
    }
}
