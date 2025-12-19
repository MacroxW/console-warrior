import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Console Warrior Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start Console Warrior tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('MacroxW.console-warrior'));
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('MacroxW.console-warrior');
        if (extension) {
            await extension.activate();
            assert.ok(extension.isActive);
        }
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        
        const expectedCommands = [
            'console-warrior.run',
            'console-warrior.runProject',
            'console-warrior.start',
            'console-warrior.stop',
            'console-warrior.clear',
            'console-warrior.refresh',
            'console-warrior.showOutput',
            'console-warrior.showMenu'
        ];

        expectedCommands.forEach(cmd => {
            assert.ok(
                commands.includes(cmd),
                `Command ${cmd} should be registered`
            );
        });
    });
});
