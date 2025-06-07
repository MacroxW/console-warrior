import * as vscode from 'vscode';

export class StatusBarManager {
    private readonly statusBarItem: vscode.StatusBarItem;
    private isActive: boolean = false;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.updateStatusBar();
    }

    public activate(): void {
        this.isActive = true;
        this.updateStatusBar();
        this.statusBarItem.show();
    }

    public deactivate(): void {
        this.isActive = false;
        this.updateStatusBar();
    }

    public toggle(): void {
        if (this.isActive) {
            this.pause();
        } else {
            this.start();
        }
    }

    public start(): void {
        this.isActive = true;
        this.updateStatusBar();
        vscode.commands.executeCommand('console-warrior.startMonitoring');
        vscode.window.showInformationMessage('🥷 Console Warrior started!');
    }

    public pause(): void {
        this.isActive = false;
        this.updateStatusBar();
        vscode.commands.executeCommand('console-warrior.stopMonitoring');
        vscode.window.showInformationMessage('⏸️ Console Warrior paused');
    }

    public showOutput(): void {
        vscode.commands.executeCommand('console-warrior.viewLogs');
    }

    public clearOutput(): void {
        vscode.commands.executeCommand('console-warrior.clearLogs');
        vscode.window.showInformationMessage('🧹 Console Warrior output cleared');
    }

    private updateStatusBar(): void {
        if (this.isActive) {
            this.statusBarItem.text = '$(debug-console) Warrior';
            this.statusBarItem.tooltip = this.createActiveTooltip();
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = '$(debug-console) Warrior';
            this.statusBarItem.tooltip = this.createPausedTooltip();
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
        this.statusBarItem.command = 'console-warrior.statusBarMenu';
    }

    private createActiveTooltip(): vscode.MarkdownString {
        const tooltip = new vscode.MarkdownString();
        tooltip.isTrusted = true;
        tooltip.appendMarkdown('**Console Warrior Active** 🥷\n\n');
        tooltip.appendMarkdown('Console Warrior is monitoring your console logs and displaying them beside your code.\n\n');
        tooltip.appendMarkdown('**What to do next**\n');
        tooltip.appendMarkdown('- Add console.log statements to see them beside your code\n');
        tooltip.appendMarkdown('- Use the menu to pause or view output\n');
        tooltip.appendMarkdown('- Check the output panel for detailed logs');
        return tooltip;
    }

    private createPausedTooltip(): vscode.MarkdownString {
        const tooltip = new vscode.MarkdownString();
        tooltip.isTrusted = true;
        tooltip.appendMarkdown('**Console Warrior Paused** ⏸️\n\n');
        tooltip.appendMarkdown('Console Warrior is paused. When Console Warrior is paused on your project, it will remain paused until you start it on your project again.\n\n');
        tooltip.appendMarkdown('**What to do next**\n');
        tooltip.appendMarkdown('You may start Console Warrior with the menu or command palette. The status bar icon will update once it starts.\n\n');
        tooltip.appendMarkdown('If you have issues:\n');
        tooltip.appendMarkdown('- Check the output panel for errors\n');
        tooltip.appendMarkdown('- Report issues on GitHub');
        return tooltip;
    }

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}

