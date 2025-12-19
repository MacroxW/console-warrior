import * as vscode from 'vscode';
import { WatcherService } from '../services';

/**
 * StatusBar - Manages the status bar item for Console Warrior
 */
export class StatusBar implements vscode.Disposable {
    private static instance: StatusBar;
    private statusBarItem: vscode.StatusBarItem;
    private watcherService: WatcherService;

    private constructor() {
        this.watcherService = WatcherService.getInstance();
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'console-warrior.showMenu';
        this.update();
        this.statusBarItem.show();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): StatusBar {
        if (!StatusBar.instance) {
            StatusBar.instance = new StatusBar();
        }
        return StatusBar.instance;
    }

    /**
     * Update status bar appearance based on current state
     */
    public update(): void {
        const isActive = this.watcherService.isActive();

        if (isActive) {
            this.statusBarItem.text = '$(eye) Console Warrior';
            this.statusBarItem.tooltip = this.createActiveTooltip();
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = '$(eye-closed) Console Warrior';
            this.statusBarItem.tooltip = this.createInactiveTooltip();
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
    }

    /**
     * Create tooltip for active state
     */
    private createActiveTooltip(): vscode.MarkdownString {
        const tooltip = new vscode.MarkdownString();
        tooltip.isTrusted = true;
        tooltip.appendMarkdown('**🥷 Console Warrior - Active**\n\n');
        tooltip.appendMarkdown('Watching for console logs...\n\n');
        tooltip.appendMarkdown('Click to open menu');
        return tooltip;
    }

    /**
     * Create tooltip for inactive state
     */
    private createInactiveTooltip(): vscode.MarkdownString {
        const tooltip = new vscode.MarkdownString();
        tooltip.isTrusted = true;
        tooltip.appendMarkdown('**🥷 Console Warrior - Inactive**\n\n');
        tooltip.appendMarkdown('Click to start monitoring');
        return tooltip;
    }

    /**
     * Show the status bar item
     */
    public show(): void {
        this.statusBarItem.show();
    }

    /**
     * Hide the status bar item
     */
    public hide(): void {
        this.statusBarItem.hide();
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        this.statusBarItem.dispose();
    }
}
