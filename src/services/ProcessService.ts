import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { LogService } from './LogService';

/**
 * ProcessService - Manages Node.js process execution with Console Warrior loader
 */
export class ProcessService implements vscode.Disposable {
    private static instance: ProcessService;
    private terminal: vscode.Terminal | undefined;
    private readonly logService: LogService;
    private readonly loaderPath: string;

    private constructor(extensionPath: string) {
        this.logService = LogService.getInstance();
        this.loaderPath = path.join(extensionPath, 'loader', 'index.js');
    }

    /**
     * Initialize the service with extension path
     */
    public static initialize(extensionPath: string): ProcessService {
        if (!ProcessService.instance) {
            ProcessService.instance = new ProcessService(extensionPath);
        }
        return ProcessService.instance;
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ProcessService {
        if (!ProcessService.instance) {
            throw new Error('ProcessService not initialized. Call initialize() first.');
        }
        return ProcessService.instance;
    }

    /**
     * Run a Node.js file with Console Warrior loader
     */
    public async runWithLoader(filePath?: string): Promise<void> {
        // Get file to run
        let targetFile = filePath;

        if (!targetFile) {
            // Try to get from active editor
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.fileName.endsWith('.js')) {
                targetFile = activeEditor.document.fileName;
            } else {
                // Ask user to select a file
                const files = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        'JavaScript': ['js'],
                        'All Files': ['*']
                    },
                    title: 'Select JavaScript file to run'
                });

                if (!files || files.length === 0) {
                    return;
                }

                targetFile = files[0].fsPath;
            }
        }

        if (!targetFile) {
            vscode.window.showErrorMessage('No file selected to run');
            return;
        }

        // Verify file exists
        if (!fs.existsSync(targetFile)) {
            vscode.window.showErrorMessage(`File not found: ${targetFile}`);
            return;
        }

        // Verify loader exists
        if (!fs.existsSync(this.loaderPath)) {
            vscode.window.showErrorMessage(`Console Warrior loader not found at: ${this.loaderPath}`);
            return;
        }

        // Get working directory
        const workingDir = path.dirname(targetFile);

        // Close existing terminal if any
        if (this.terminal) {
            this.terminal.dispose();
        }

        // Create new terminal
        this.terminal = vscode.window.createTerminal({
            name: '🥷 Console Warrior',
            cwd: workingDir
        });

        // Build command
        const command = `node --require "${this.loaderPath}" "${targetFile}"`;

        // Show terminal and run command
        this.terminal.show();
        this.terminal.sendText(command);

        this.logService.log(`🚀 Running: ${command}`);
        vscode.window.showInformationMessage(`🥷 Console Warrior: Running ${path.basename(targetFile)}`);
    }

    /**
     * Run a Node.js project (looks for package.json scripts)
     */
    public async runProject(projectPath?: string): Promise<void> {
        let targetPath = projectPath;

        if (!targetPath) {
            // Try to get from workspace
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                if (workspaceFolders.length === 1) {
                    targetPath = workspaceFolders[0].uri.fsPath;
                } else {
                    // Let user select workspace
                    const selected = await vscode.window.showWorkspaceFolderPick({
                        placeHolder: 'Select project to run'
                    });
                    if (selected) {
                        targetPath = selected.uri.fsPath;
                    }
                }
            }
        }

        if (!targetPath) {
            vscode.window.showErrorMessage('No project selected');
            return;
        }

        // Look for package.json
        const packageJsonPath = path.join(targetPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            // No package.json, try to find main file
            const mainFile = this.findMainFile(targetPath);
            if (mainFile) {
                await this.runWithLoader(mainFile);
            } else {
                vscode.window.showErrorMessage('No package.json or main file found');
            }
            return;
        }

        // Read package.json
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Find entry point
        const entryPoint = packageJson.main || 'index.js';
        const entryPath = path.join(targetPath, entryPoint);

        if (fs.existsSync(entryPath)) {
            await this.runWithLoader(entryPath);
        } else {
            // Try common entry points
            const mainFile = this.findMainFile(targetPath);
            if (mainFile) {
                await this.runWithLoader(mainFile);
            } else {
                vscode.window.showErrorMessage(`Entry point not found: ${entryPoint}`);
            }
        }
    }

    /**
     * Find main file in a directory
     */
    private findMainFile(dir: string): string | undefined {
        const candidates = ['index.js', 'main.js', 'app.js', 'server.js', 'src/index.js'];
        
        for (const candidate of candidates) {
            const filePath = path.join(dir, candidate);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }

        return undefined;
    }

    /**
     * Stop the running process
     */
    public stop(): void {
        if (this.terminal) {
            this.terminal.dispose();
            this.terminal = undefined;
            this.logService.log('⏹️ Process stopped');
            vscode.window.showInformationMessage('🥷 Console Warrior: Process stopped');
        }
    }

    /**
     * Show the terminal
     */
    public showTerminal(): void {
        if (this.terminal) {
            this.terminal.show();
        } else {
            vscode.window.showInformationMessage('No Console Warrior process running');
        }
    }

    /**
     * Check if a process is running
     */
    public isRunning(): boolean {
        return this.terminal !== undefined;
    }

    /**
     * Get the loader path
     */
    public getLoaderPath(): string {
        return this.loaderPath;
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        if (this.terminal) {
            this.terminal.dispose();
            this.terminal = undefined;
        }
    }
}
