// Mock utilities for Console Warrior tests

export interface MockLogEntry {
    index: number;
    type: string;
    message: string;
    timestamp: string;
    lineNumber: number | null;
}

export class MockTerminalCapture {
    private static readonly logs: MockLogEntry[] = [];

    public static createMockLogs(): MockLogEntry[] {
        return [
            {
                index: 0,
                type: 'log',
                message: '🚀 Console Warrior Test Project Started!',
                timestamp: new Date().toISOString(),
                lineNumber: 97
            },
            {
                index: 1,
                type: 'log',
                message: 'Hello, World!',
                timestamp: new Date().toISOString(),
                lineNumber: 100
            },
            {
                index: 2,
                type: 'log',
                message: 'Welcome Developer',
                timestamp: new Date().toISOString(),
                lineNumber: 105
            },
            {
                index: 3,
                type: 'log',
                message: 'Project: Console Warrior',
                timestamp: new Date().toISOString(),
                lineNumber: 106
            },
            {
                index: 4,
                type: 'error',
                message: 'This is an error message',
                timestamp: new Date().toISOString(),
                lineNumber: 120
            },
            {
                index: 5,
                type: 'warn',
                message: 'This is a warning message',
                timestamp: new Date().toISOString(),
                lineNumber: 121
            }
        ];
    }

    public static createMockLogWithLineNumbers(startLine: number, count: number): MockLogEntry[] {
        const logs: MockLogEntry[] = [];
        for (let i = 0; i < count; i++) {
            logs.push({
                index: i,
                type: 'log',
                message: `Mock log message ${i + 1}`,
                timestamp: new Date().toISOString(),
                lineNumber: startLine + i
            });
        }
        return logs;
    }

    public static createComplexMockLogs(): MockLogEntry[] {
        return [
            {
                index: 0,
                type: 'log',
                message: JSON.stringify({ name: 'John', age: 30, role: 'Developer' }),
                timestamp: new Date().toISOString(),
                lineNumber: 109
            },
            {
                index: 1,
                type: 'log',
                message: JSON.stringify(['red', 'green', 'blue']),
                timestamp: new Date().toISOString(),
                lineNumber: 110
            },
            {
                index: 2,
                type: 'log',
                message: 'Calculating sum of 5 + 3',
                timestamp: new Date().toISOString(),
                lineNumber: 114
            },
            {
                index: 3,
                type: 'log',
                message: 'Result: 8',
                timestamp: new Date().toISOString(),
                lineNumber: 116
            }
        ];
    }
}

export class MockWorkspaceHelper {
    public static createMockWorkspaceFolder(path: string): any {
        return {
            uri: { fsPath: path },
            name: 'mock-workspace',
            index: 0
        };
    }

    public static getMockTestProjectPath(workspacePath: string): string {
        return `${workspacePath}/projects/test-node-project`;
    }
}

export class MockVSCodeHelper {
    public static simulateFileOpen(filePath: string): Promise<any> {
        // Mock implementation for testing
        return Promise.resolve({
            fileName: filePath,
            lineCount: 100,
            lineAt: (line: number) => ({
                text: `// Mock line ${line}`,
                range: { start: { line, character: 0 }, end: { line, character: 20 } }
            })
        });
    }

    public static simulateCommand(command: string): Promise<void> {
        console.log(`Mock command executed: ${command}`);
        return Promise.resolve();
    }
}
