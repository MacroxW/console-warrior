import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/test/**/*.test.js',
    workspaceFolder: './',
    extensionDevelopmentPath: './',
    mocha: {
        ui: 'tdd',
        timeout: 20000,
        color: true
    },
    coverage: {
        include: ['out/src/**/*.js'],
        exclude: ['out/test/**/*.js']
    }
});
