import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export class ViteProjectManager {
    private static readonly PROJECTS_FOLDER = 'vite-projects';
    private static readonly logDecorations: Map<string, vscode.TextEditorDecorationType> = new Map();
    private static readonly logData: Map<string, string[]> = new Map();

    /**
     * Creates a new Vite project in the extension's workspace
     */
    static async createViteProject(): Promise<void> {
        try {
            // Get project name from user
            const projectName = await vscode.window.showInputBox({
                prompt: 'Enter the name for your Vite project',
                value: 'my-vite-project',
                placeHolder: 'project-name',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Project name cannot be empty';
                    }
                    if (!/^[a-z0-9-_]+$/i.test(value)) {
                        return 'Project name can only contain letters, numbers, hyphens, and underscores';
                    }
                    return null;
                }
            });

            if (!projectName) {
                return;
            }

            // Create project path in user's home directory under a dedicated folder
            const homeDir = os.homedir();
            const projectsBaseDir = path.join(homeDir, 'VSCode-Extension-Projects', this.PROJECTS_FOLDER);
            const projectPath = path.join(projectsBaseDir, projectName);

            // Check if project already exists
            if (fs.existsSync(projectPath)) {
                const overwrite = await vscode.window.showWarningMessage(
                    `Project "${projectName}" already exists. Do you want to overwrite it?`,
                    'Yes', 'No'
                );
                if (overwrite !== 'Yes') {
                    return;
                }
            }

            await this.createProjectWithProgress(projectName, projectPath);

        } catch (error) {
            console.error('Error creating Vite project:', error);
            vscode.window.showErrorMessage(`Failed to create Vite project: ${error}`);
        }
    }

    /**
     * Creates the Vite project with a progress indicator
     */
    private static async createProjectWithProgress(projectName: string, projectPath: string): Promise<void> {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Creating Vite Project: ${projectName}`,
            cancellable: false
        }, async (progress) => {
            
            progress.report({ increment: 10, message: "Setting up project structure..." });
            
            // Create project directory
            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(projectPath, { recursive: true });
            }

            progress.report({ increment: 20, message: "Creating package.json..." });
            await this.createPackageJson(projectPath, projectName);

            progress.report({ increment: 30, message: "Creating HTML file..." });
            await this.createIndexHtml(projectPath, projectName);

            progress.report({ increment: 40, message: "Creating JavaScript files..." });
            await this.createMainJs(projectPath);

            progress.report({ increment: 50, message: "Creating CSS styles..." });
            await this.createStyleCss(projectPath);

            progress.report({ increment: 70, message: "Creating Vite configuration..." });
            await this.createViteConfig(projectPath);

            progress.report({ increment: 80, message: "Creating README..." });
            await this.createReadme(projectPath, projectName);

            progress.report({ increment: 90, message: "Creating .gitignore..." });
            await this.createGitignore(projectPath);
            
            progress.report({ increment: 100, message: "Opening project..." });

            // Open the project in a new VS Code window
            const uri = vscode.Uri.file(projectPath);
            await vscode.commands.executeCommand('vscode.openFolder', uri, true);
            
            vscode.window.showInformationMessage(
                `Vite project "${projectName}" created successfully! Run "yarn install" to get started.`
            );
        });
    }

    private static async createPackageJson(projectPath: string, projectName: string): Promise<void> {
        const packageJson = {
            name: projectName,
            private: true,
            version: "0.0.0",
            type: "module",
            scripts: {
                dev: "vite",
                build: "vite build",
                preview: "vite preview"
            },
            devDependencies: {
                vite: "^5.0.0"
            }
        };
        
        const content = JSON.stringify(packageJson, null, 2);
        fs.writeFileSync(path.join(projectPath, 'package.json'), content);
    }

    private static async createIndexHtml(projectPath: string, projectName: string): Promise<void> {
        const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>`;
        
        fs.writeFileSync(path.join(projectPath, 'index.html'), indexHtml);
    }

    private static async createMainJs(projectPath: string): Promise<void> {
        const mainJs = `import './style.css'

document.querySelector('#app').innerHTML = \`
  <div>
    <h1>Hello Vite!</h1>
    <div class="card">
      <p>
        Welcome to your new Vite project! 🚀
      </p>
      <p>
        Edit <code>main.js</code> and save to test HMR
      </p>
    </div>
    <p class="read-the-docs">
      <a href="https://vitejs.dev" target="_blank">Click here to learn more about Vite</a>
    </p>
  </div>
\`

console.log('Hello from Vite! 🎉')`;
        
        fs.writeFileSync(path.join(projectPath, 'main.js'), mainJs);
    }

    private static async createStyleCss(projectPath: string): Promise<void> {
        const styleCss = `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  background: linear-gradient(45deg, #646cff, #747bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  padding: 2em;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 2em 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.read-the-docs {
  color: #888;
  margin-top: 2em;
}

code {
  background-color: #1a1a1a;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 0.9em;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  code {
    background-color: #f1f1f1;
  }
}`;
        
        fs.writeFileSync(path.join(projectPath, 'style.css'), styleCss);
    }

    private static async createViteConfig(projectPath: string): Promise<void> {
        const viteConfig = `import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`;
        
        fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig);
    }

    private static async createReadme(projectPath: string, projectName: string): Promise<void> {
        const readmeMd = `# ${projectName}

A Vite project created by HelloWorld VS Code Extension!

## Getting Started

1. Install dependencies:
   \`\`\`bash
   yarn install
   \`\`\`

2. Start development server:
   \`\`\`bash
   yarn dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   yarn build
   \`\`\`

4. Preview production build:
   \`\`\`bash
   yarn preview
   \`\`\`

## Features

- ⚡️ Lightning fast HMR
- 🎯 Modern build tooling
- 🚀 Ready to deploy
- 📱 Mobile responsive
- 🌙 Dark/Light mode support

## Project Structure

\`\`\`
${projectName}/
├── index.html          # Entry HTML file
├── main.js             # Main JavaScript file
├── style.css           # Styles
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
└── README.md          # This file
\`\`\`

## Development Tips

- Edit \`main.js\` to see HMR in action
- Modify \`style.css\` for styling changes
- Check \`vite.config.js\` for build configurations

Happy coding! 🎉`;
        
        fs.writeFileSync(path.join(projectPath, 'README.md'), readmeMd);
    }

    private static async createGitignore(projectPath: string): Promise<void> {
        const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;
        
        fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
    }

    /**
     * Start Vite dev server for an existing project
     */
    static async startViteDevServer(): Promise<void> {
        // Check if we're in the extension development workspace and suggest the test project
        const currentWorkspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
        const isExtensionWorkspace = currentWorkspace.includes('first-vscode-extension');
        const defaultPath = isExtensionWorkspace 
            ? path.join(currentWorkspace, 'projects', 'test-vite-project')
            : currentWorkspace;

        const viteProjectPath = await vscode.window.showInputBox({
            prompt: 'Enter the path to your Vite project',
            value: defaultPath,
            placeHolder: '/path/to/vite-project'
        });

        if (!viteProjectPath) {
            return;
        }

        // Verify that it's a valid Vite project
        const packageJsonPath = path.join(viteProjectPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            vscode.window.showErrorMessage('No package.json found in the specified directory');
            return;
        }

        // Create a new terminal for Vite
        const terminal = vscode.window.createTerminal({
            name: 'Vite Dev Server',
            cwd: viteProjectPath
        });

        terminal.show();
        terminal.sendText('yarn dev');
        vscode.window.showInformationMessage('Vite dev server started in terminal!');
    }

    /**
     * Focus on Vite logs terminal
     */
    static readViteLogs(): void {
        const viteTerminal = vscode.window.terminals.find(terminal => 
            terminal.name === 'Vite Dev Server'
        );

        if (viteTerminal) {
            viteTerminal.show();
            vscode.window.showInformationMessage('Vite terminal focused - check the logs!');
        } else {
            vscode.window.showWarningMessage('No Vite terminal found. Start Vite first.');
        }
    }

    /**
     * Capture and display logs beside console.log statements
     */
    static async captureAndDisplayLogs(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;

        // Clear previous decorations for this file
        this.clearLogDecorations(filePath);

        // Find all console.log lines
        const logLines = this.findConsoleLogLines(document);
        
        if (logLines.length === 0) {
            vscode.window.showInformationMessage('No console.log statements found in current file');
            return;
        }

        // Simulate log capture (in real scenario, this would parse actual terminal output)
        const mockLogs = logLines.map((logInfo, index) => {
            const timestamp = new Date().toLocaleTimeString();
            return `[${timestamp}] ${logInfo.logContent}`;
        });

        // Create decorations for each log line
        const decorations: vscode.DecorationOptions[] = [];
        
        logLines.forEach((lineInfo, index) => {
            const logMessage = mockLogs[index] || 'Log output here';
            
            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(lineInfo.lineNumber, lineInfo.endCharacter, lineInfo.lineNumber, lineInfo.endCharacter),
                renderOptions: {
                    after: {
                        contentText: ` 📋 ${logMessage}`,
                        color: '#00ff88',
                        fontStyle: 'italic',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        margin: '0 0 0 10px'
                    }
                }
            };
            
            decorations.push(decoration);
        });

        // Create decoration type for this file
        const decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                margin: '0 0 0 10px'
            }
        });

        // Store decoration type for cleanup
        this.logDecorations.set(filePath, decorationType);

        // Apply decorations
        editor.setDecorations(decorationType, decorations);
        
        vscode.window.showInformationMessage(`Captured ${decorations.length} log outputs!`);
    }

    /**
     * Clear log decorations for a specific file
     */
    static clearLogDecorations(filePath?: string): void {
        if (filePath && this.logDecorations.has(filePath)) {
            const decorationType = this.logDecorations.get(filePath);
            if (decorationType) {
                decorationType.dispose();
                this.logDecorations.delete(filePath);
            }
        } else {
            // Clear all decorations
            this.logDecorations.forEach((decorationType) => {
                decorationType.dispose();
            });
            this.logDecorations.clear();
        }

        const editor = vscode.window.activeTextEditor;
        if (editor && filePath === editor.document.fileName) {
            vscode.window.showInformationMessage('Log decorations cleared!');
        }
    }

    /**
     * Find all console.log lines in the document
     */
    private static findConsoleLogLines(document: vscode.TextDocument): Array<{lineNumber: number, endCharacter: number, logContent: string}> {
        const logLines: Array<{lineNumber: number, endCharacter: number, logContent: string}> = [];
        
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;
            
            // Look for console.log statements (simple regex)
            const consoleLogRegex = /console\.log\s*\(\s*(['"`])(.*?)\1\s*\)/;
            const consoleLogMatch = consoleLogRegex.exec(text);
            if (consoleLogMatch) {
                logLines.push({
                    lineNumber: i,
                    endCharacter: text.length,
                    logContent: consoleLogMatch[2] // Extract the log message
                });
            }
        }
        
        return logLines;
    }

    /**
     * Generate mock log outputs (in real scenario, parse from terminal)
     */
    static generateMockLogs(filePath: string): string[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.fileName !== filePath) {
            return [];
        }

        const logLines = this.findConsoleLogLines(editor.document);
        return logLines.map((logInfo, index) => {
            const timestamp = new Date().toLocaleTimeString();
            return `[${timestamp}] ${logInfo.logContent}`;
        });
    }

    /**
     * Start real-time log monitoring (advanced feature)
     */
    static async startLogMonitoring(): Promise<void> {
        const viteTerminal = vscode.window.terminals.find(terminal => 
            terminal.name === 'Vite Dev Server'
        );

        if (!viteTerminal) {
            vscode.window.showWarningMessage('No Vite terminal found. Start Vite first.');
            return;
        }

        // This is a simplified version - real implementation would need terminal output parsing
        vscode.window.showInformationMessage('Log monitoring started! Use "Capture Console Logs" to see output beside code.');
    }
}
