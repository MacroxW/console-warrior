import * as fs from 'fs';
import * as vscode from 'vscode';
import { LogEntry, LogService } from './LogService';

/**
 * Callback type for log updates
 */
export type LogUpdateCallback = (logs: LogEntry[]) => void;

/**
 * WatcherService - Watches the log file for changes and notifies subscribers
 */
export class WatcherService implements vscode.Disposable {
    private static instance: WatcherService;
    private fileWatcher: NodeJS.Timeout | undefined;
    private lastModTime: number = 0;
    private lastLogCount: number = 0;
    private isWatching: boolean = false;
    private callbacks: LogUpdateCallback[] = [];
    private readonly logService: LogService;
    private readonly pollInterval: number = 300; // ms

    private constructor() {
        this.logService = LogService.getInstance();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): WatcherService {
        if (!WatcherService.instance) {
            WatcherService.instance = new WatcherService();
        }
        return WatcherService.instance;
    }

    /**
     * Start watching the log file for changes
     */
    public startWatching(): void {
        if (this.isWatching) {
            return;
        }

        this.isWatching = true;
        this.lastModTime = 0;
        this.lastLogCount = 0;

        this.logService.log('🔍 Started watching for log changes');

        this.fileWatcher = setInterval(() => {
            this.checkForChanges();
        }, this.pollInterval);
    }

    /**
     * Stop watching the log file
     */
    public stopWatching(): void {
        if (!this.isWatching) {
            return;
        }

        this.isWatching = false;

        if (this.fileWatcher) {
            clearInterval(this.fileWatcher);
            this.fileWatcher = undefined;
        }

        this.logService.log('⏹️ Stopped watching for log changes');
    }

    /**
     * Check if currently watching
     */
    public isActive(): boolean {
        return this.isWatching;
    }

    /**
     * Subscribe to log updates
     */
    public onLogUpdate(callback: LogUpdateCallback): vscode.Disposable {
        this.callbacks.push(callback);

        return {
            dispose: () => {
                const index = this.callbacks.indexOf(callback);
                if (index > -1) {
                    this.callbacks.splice(index, 1);
                }
            }
        };
    }

    /**
     * Check for changes in the log file
     */
    private checkForChanges(): void {
        const logFilePath = this.logService.getLogFilePath();

        try {
            if (!fs.existsSync(logFilePath)) {
                return;
            }

            const stats = fs.statSync(logFilePath);
            const currentModTime = stats.mtime.getTime();

            // Check if file has been modified
            if (currentModTime <= this.lastModTime) {
                return;
            }

            this.lastModTime = currentModTime;

            // Read logs and check for new entries
            const logs = this.logService.readLogs();
            
            if (logs.length > this.lastLogCount) {
                const newLogs = logs.slice(this.lastLogCount);
                this.lastLogCount = logs.length;

                this.logService.log(`📡 ${newLogs.length} new log(s) detected`);

                // Notify all subscribers
                this.notifySubscribers(newLogs);
            }
        } catch (error) {
            // Silently ignore errors to not disrupt the extension
        }
    }

    /**
     * Notify all subscribers of new logs
     */
    private notifySubscribers(newLogs: LogEntry[]): void {
        this.callbacks.forEach(callback => {
            try {
                callback(newLogs);
            } catch (error) {
                this.logService.log(`Error in log update callback: ${error}`);
            }
        });
    }

    /**
     * Force a refresh of logs
     */
    public refresh(): void {
        this.lastModTime = 0;
        this.lastLogCount = 0;
        this.checkForChanges();
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        this.stopWatching();
        this.callbacks = [];
    }
}
