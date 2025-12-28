import * as fs from 'fs';
import * as path from 'path';

interface LogEntry {
    index: number;
    type: string;
    message: string;
    timestamp: string;
    lineNumber: number | null;
}

export class TerminalCapture {
    private static logOutputFile: string;
    private static fileWatcher: NodeJS.Timeout | undefined;
    private static onLogCaptured: ((logs: LogEntry[]) => void) | undefined;
    private static lastProcessedIndex: number = -1;
    private static lastFileModTime: number = 0;

    public static initialize(workspaceFolder: string): void {
        // Look for the log file in the test project directory
        this.logOutputFile = path.join(
            workspaceFolder,
            '.console-warrior-logs.json'
        );
        console.log('[ConsoleWarrior] TerminalCapture logOutputFile:', this.logOutputFile);
    }

    public static startCapturing(callback: (logs: LogEntry[]) => void): void {
        this.onLogCaptured = callback;
        this.lastProcessedIndex = -1;
        console.log('[ConsoleWarrior] startCapturing, logOutputFile:', this.logOutputFile);
        // Ya no se borra el archivo de logs aquí
        this.startWatching();
    }

    private static startWatching(): void {
        console.log('[ConsoleWarrior] startWatching, logOutputFile:', this.logOutputFile);
        // Check periodically for file changes
        this.fileWatcher = setInterval(() => {
            this.readNewLogs();
        }, 500); // Check every 500ms for new logs
    }

    private static readNewLogs(): void {
        if (!fs.existsSync(this.logOutputFile)) {
            return;
        }

        try {
            const stats = fs.statSync(this.logOutputFile);
            const currentModTime = stats.mtime.getTime();

            // Check if file has been modified since last read
            if (currentModTime <= this.lastFileModTime) {
                return;
            }

            this.lastFileModTime = currentModTime;

            const content = fs.readFileSync(this.logOutputFile, 'utf8');
            if (!content.trim()) {
                return;
            }
            console.log('[ConsoleWarrior] Log file read, content length:', content.length);

            const logs: LogEntry[] = JSON.parse(content);

            // If this is a fresh log file (after recompilation), reset index
            if (logs.length > 0 && logs[0].index === 0 && this.lastProcessedIndex > 0) {
                console.log('[ConsoleWarrior] Detected fresh log file, resetting index');
                this.lastProcessedIndex = -1;
            }

            // Only process new logs
            const newLogs = logs.filter(log => log.index > this.lastProcessedIndex);

            if (newLogs.length > 0 && this.onLogCaptured) {
                this.lastProcessedIndex = Math.max(...newLogs.map(log => log.index));
                console.log('[ConsoleWarrior] New logs found:', newLogs.length, newLogs.map(l => l.message));
                this.onLogCaptured(newLogs);
            }
        } catch (error) {
            console.error('[ConsoleWarrior] Error reading/parsing log file:', error);
        }
    }

    public static stopCapturing(): void {
        this.onLogCaptured = undefined;

        if (this.fileWatcher) {
            clearInterval(this.fileWatcher);
            this.fileWatcher = undefined;
        }
    }

    public static dispose(): void {
        this.stopCapturing();

        // Clean up log file
        try {
            if (fs.existsSync(this.logOutputFile)) {
                fs.unlinkSync(this.logOutputFile);
            }
        } catch (error) {
            console.error('[ConsoleWarrior] Failed to cleanup log file:', error);
        }
    }
}