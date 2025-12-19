/**
 * Console Warrior Extension
 * 
 * A free alternative to Console Ninja - Dynamic logging visualization
 * for Node.js applications directly in VS Code.
 */

import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { DecorationProvider } from './providers';
import { LogService, ProcessService, WatcherService } from './services';
import { StatusBar } from './ui';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
    const logService = LogService.getInstance();
    logService.log('🥷 Console Warrior is activating...');

    // Initialize services
    ProcessService.initialize(context.extensionPath);
    const watcherService = WatcherService.getInstance();
    const decorationProvider = DecorationProvider.getInstance();
    const statusBar = StatusBar.getInstance();

    // Register commands
    registerCommands(context);

    // Subscribe to log updates
    const logUpdateSubscription = watcherService.onLogUpdate(() => {
        decorationProvider.refreshAll();
    });

    // Update decorations when active editor changes
    const editorChangeSubscription = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            decorationProvider.updateDecorations(editor);
        }
    });

    // Update decorations when document is saved
    const documentSaveSubscription = vscode.workspace.onDidSaveTextDocument(() => {
        decorationProvider.refreshAll();
    });

    // Add disposables to context
    context.subscriptions.push(
        logService,
        watcherService,
        decorationProvider,
        statusBar,
        logUpdateSubscription,
        editorChangeSubscription,
        documentSaveSubscription
    );

    logService.log('🥷 Console Warrior is ready!');
    vscode.window.showInformationMessage('🥷 Console Warrior is ready! Use the status bar or command palette to get started.');
}

/**
 * Extension deactivation
 */
export function deactivate() {
    // Cleanup is handled by disposables
}
