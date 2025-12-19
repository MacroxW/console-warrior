import * as vscode from 'vscode';
import { LogService, ProcessService, WatcherService } from '../services';
import { DecorationProvider } from '../providers';
import { StatusBar } from '../ui';

/**
 * Register all extension commands
 */
export function registerCommands(context: vscode.ExtensionContext): void {
    const logService = LogService.getInstance();
    const watcherService = WatcherService.getInstance();
    const decorationProvider = DecorationProvider.getInstance();
    const processService = ProcessService.getInstance();
    const statusBar = StatusBar.getInstance();

    // Run file with Console Warrior
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.run', async () => {
            await processService.runWithLoader();
            watcherService.startWatching();
            statusBar.update();
        })
    );

    // Run project with Console Warrior
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.runProject', async () => {
            await processService.runProject();
            watcherService.startWatching();
            statusBar.update();
        })
    );

    // Start watching for logs
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.start', () => {
            watcherService.startWatching();
            statusBar.update();
            vscode.window.showInformationMessage('🥷 Console Warrior started!');
        })
    );

    // Stop watching for logs
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.stop', () => {
            watcherService.stopWatching();
            processService.stop();
            statusBar.update();
            vscode.window.showInformationMessage('🥷 Console Warrior stopped');
        })
    );

    // Clear logs and decorations
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.clear', () => {
            logService.clearLogs();
            decorationProvider.clearDecorations();
            vscode.window.showInformationMessage('🧹 Logs cleared');
        })
    );

    // Refresh decorations
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.refresh', () => {
            watcherService.refresh();
            decorationProvider.refreshAll();
        })
    );

    // Show output panel
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.showOutput', () => {
            logService.showOutput();
        })
    );

    // Show menu
    context.subscriptions.push(
        vscode.commands.registerCommand('console-warrior.showMenu', async () => {
            const isActive = watcherService.isActive();
            const isRunning = processService.isRunning();

            const items: vscode.QuickPickItem[] = [
                {
                    label: '$(play) Run Current File',
                    description: 'Run the current file with Console Warrior',
                    detail: 'Executes the file with log capturing enabled'
                },
                {
                    label: '$(folder) Run Project',
                    description: 'Run the project with Console Warrior',
                    detail: 'Finds and runs the main entry point'
                },
                {
                    label: isActive ? '$(debug-pause) Stop Watching' : '$(eye) Start Watching',
                    description: isActive ? 'Stop monitoring for logs' : 'Start monitoring for logs'
                },
                {
                    label: '$(refresh) Refresh Decorations',
                    description: 'Refresh log decorations in all editors'
                },
                {
                    label: '$(trash) Clear Logs',
                    description: 'Clear all captured logs and decorations'
                },
                {
                    label: '$(output) Show Output',
                    description: 'Show the Console Warrior output panel'
                }
            ];

            if (isRunning) {
                items.splice(2, 0, {
                    label: '$(debug-stop) Stop Process',
                    description: 'Stop the running Node.js process'
                });
            }

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: '🥷 Console Warrior'
            });

            if (!selected) {
                return;
            }

            if (selected.label.includes('Run Current File')) {
                await vscode.commands.executeCommand('console-warrior.run');
            } else if (selected.label.includes('Run Project')) {
                await vscode.commands.executeCommand('console-warrior.runProject');
            } else if (selected.label.includes('Stop Watching') || selected.label.includes('Start Watching')) {
                if (isActive) {
                    await vscode.commands.executeCommand('console-warrior.stop');
                } else {
                    await vscode.commands.executeCommand('console-warrior.start');
                }
            } else if (selected.label.includes('Stop Process')) {
                processService.stop();
                statusBar.update();
            } else if (selected.label.includes('Refresh')) {
                await vscode.commands.executeCommand('console-warrior.refresh');
            } else if (selected.label.includes('Clear')) {
                await vscode.commands.executeCommand('console-warrior.clear');
            } else if (selected.label.includes('Output')) {
                await vscode.commands.executeCommand('console-warrior.showOutput');
            }
        })
    );
}
