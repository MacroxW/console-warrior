import * as assert from 'assert';
import { StatusBarManager } from '../../statusBar';

suite('StatusBar Unit Tests', () => {
    let statusBar: StatusBarManager;

    setup(() => {
        statusBar = new StatusBarManager();
    });

    teardown(() => {
        if (statusBar) {
            statusBar.dispose();
        }
    });

    test('StatusBar should initialize without errors', () => {
        assert.doesNotThrow(() => {
            const testStatusBar = new StatusBarManager();
            testStatusBar.dispose(); // Clean up
        }, 'StatusBar initialization should not throw errors');
    });

    test('StatusBar should activate and deactivate correctly', () => {
        assert.doesNotThrow(() => {
            statusBar.activate();
        }, 'StatusBar activation should not throw errors');

        assert.doesNotThrow(() => {
            statusBar.deactivate();
        }, 'StatusBar deactivation should not throw errors');
    });

    test('StatusBar should start and pause correctly', () => {
        assert.doesNotThrow(() => {
            statusBar.start();
        }, 'StatusBar start should not throw errors');

        assert.doesNotThrow(() => {
            statusBar.pause();
        }, 'StatusBar pause should not throw errors');
    });

    test('StatusBar should toggle correctly', () => {
        assert.doesNotThrow(() => {
            statusBar.toggle();
        }, 'StatusBar toggle should not throw errors');
    });

    test('StatusBar should show and clear output correctly', () => {
        assert.doesNotThrow(() => {
            statusBar.showOutput();
        }, 'StatusBar showOutput should not throw errors');

        assert.doesNotThrow(() => {
            statusBar.clearOutput();
        }, 'StatusBar clearOutput should not throw errors');
    });

    test('StatusBar should dispose correctly', () => {
        assert.doesNotThrow(() => {
            statusBar.dispose();
        }, 'StatusBar dispose should not throw errors');
    });
});
