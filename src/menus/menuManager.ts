import * as vscode from 'vscode';
import { StatusBarManager } from '../statusBar';

export class MenuManager {
    private static statusBarManager: StatusBarManager;

    public static initialize(statusBarManager: StatusBarManager): void {
        this.statusBarManager = statusBarManager;
    }

    public static async showStatusBarMenu(): Promise<void> {
        const items: vscode.QuickPickItem[] = [
            {
                label: '$(play) Start Console Warrior',
                description: 'Begin monitoring console logs',
                detail: 'Start capturing and displaying logs beside your code'
            },
            {
                label: '$(debug-pause) Pause Console Warrior',
                description: 'Stop monitoring console logs',
                detail: 'Pause the log monitoring but keep existing decorations'
            },
            {
                label: '$(output) Show Output',
                description: 'Open Console Warrior output panel',
                detail: 'View detailed logs and monitoring information'
            },
            {
                label: '$(clear-all) Clear Output',
                description: 'Clear all logs and decorations',
                detail: 'Remove all console log decorations and clear output'
            },
            {
                label: '$(refresh) Capture Current File',
                description: 'Scan current file for console logs',
                detail: 'Manually trigger log capture for the active file'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Choose a Console Warrior action',
            title: '🥷 Console Warrior Menu'
        });

        if (!selected) {
            return;
        }

        switch (selected.label) {
            case '$(play) Start Console Warrior':
                this.statusBarManager.start();
                break;
            case '$(debug-pause) Pause Console Warrior':
                this.statusBarManager.pause();
                break;
            case '$(output) Show Output':
                this.statusBarManager.showOutput();
                break;
            case '$(clear-all) Clear Output':
                this.statusBarManager.clearOutput();
                break;
            case '$(refresh) Capture Current File':
                vscode.commands.executeCommand('console-warrior.captureLogs');
                break;
        }
    }

    public static async showProjectMenu(): Promise<void> {
        const items: vscode.QuickPickItem[] = [
            {
                label: '$(new-folder) Create Node.js Project',
                description: 'Create a new Node.js project for testing',
                detail: 'Generate a complete Node.js project with console logging examples'
            },
            {
                label: '$(play) Start Node.js Application',
                description: 'Run a Node.js application with monitoring',
                detail: 'Start Node.js in a terminal and begin log monitoring'
            },
            {
                label: '$(terminal) View Node.js Logs',
                description: 'Focus on the Node.js terminal',
                detail: 'Show the terminal where Node.js is running'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Choose a project action',
            title: '🥷 Console Warrior Projects'
        });

        if (!selected) {
            return;
        }

        // Handle project actions (implement as needed)
        switch (selected.label) {
            case '$(new-folder) Create Node.js Project':
                vscode.commands.executeCommand('console-warrior.createProject');
                break;
            case '$(play) Start Node.js Application':
                vscode.commands.executeCommand('console-warrior.startNode');
                break;
            case '$(terminal) View Node.js Logs':
                vscode.commands.executeCommand('console-warrior.viewLogs');
                break;
        }
    }
}
