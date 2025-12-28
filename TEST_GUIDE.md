# Console Warrior Testing Guide 🥷

This document outlines the testing strategy and procedures for the Console Warrior VS Code extension.

## Test Structure

```
src/test/
├── extension.test.ts          # Main extension tests
├── unit/                      # Unit tests
│   ├── logManager.test.ts     # LogManager tests
│   └── statusBar.test.ts      # StatusBar tests
├── integration/               # Integration tests
│   └── workflow.test.ts       # End-to-end workflow tests
└── mocks/                     # Mock utilities
    └── mockUtils.ts           # Test helpers and mocks
```

## Running Tests

### All Tests
```bash
yarn test
# or
yarn test:all
```

### Unit Tests Only
```bash
yarn test:unit
```

### Integration Tests Only
```bash
yarn test:integration
```

### Watch Mode
```bash
yarn test:watch
```

### Coverage Report
```bash
yarn test:coverage
```

## Test Categories

### 1. Extension Tests (`extension.test.ts`)
- Extension activation
- Command registration
- Basic functionality
- Test project structure validation

### 2. Unit Tests
- **LogManager** (`unit/logManager.test.ts`)
  - Initialization
  - Start/stop monitoring
  - Output management
  - File watching setup

- **StatusBar** (`unit/statusBar.test.ts`)
  - Status bar item creation
  - Text updates
  - Show/hide functionality
  - Disposal

### 3. Integration Tests (`integration/workflow.test.ts`)
- Complete Console Warrior workflow
- Log file creation and parsing
- Line number detection
- Console override verification
- Menu command accessibility

## Running Tests in VS Code

### Using Launch Configurations

1. **Extension Tests** - Run all tests
2. **Unit Tests Only** - Run only unit tests
3. **Integration Tests Only** - Run only integration tests

Access via Debug panel (Ctrl+Shift+D) and select the appropriate configuration.

### Using Commands

- `Developer: Run Extension Tests` - Run all tests
- Use the Test Explorer panel for granular test control

## Test Environment

### Prerequisites
- VS Code workspace with Console Warrior extension
- Test project located at `projects/test-node-project/`
- Node.js runtime available

### Test Project Structure
```
projects/test-node-project/
├── main.js                    # Main test file with console.log examples
├── package.json               # Node.js project configuration
└── README.md                  # Project documentation
```

## Mock System

The test suite includes comprehensive mocks:

- **MockTerminalCapture** - Simulates log capture
- **MockWorkspaceHelper** - Workspace utilities
- **MockVSCodeHelper** - VS Code API simulation

## Test Scenarios

### 1. Basic Functionality
- ✅ Extension loads and activates
- ✅ Commands are registered
- ✅ Status bar appears
- ✅ Components initialize without errors

### 2. Log Monitoring
- ✅ Log file watching starts
- ✅ Real-time log capture
- ✅ Line number detection
- ✅ Decoration application

### 3. Integration Workflow
- ✅ Start monitoring
- ✅ Run test project
- ✅ Capture logs from file
- ✅ Apply decorations to editor
- ✅ Stop monitoring
- ✅ Cleanup

### 4. Error Handling
- ✅ Missing log files
- ✅ Invalid log format
- ✅ File permission errors
- ✅ Workspace not available

## Manual Testing

### Quick Test
1. Press F5 to launch extension
2. Check "Warrior" button in status bar
3. Open `projects/test-node-project/main.js`
4. Run `node main.js` in terminal
5. Verify decorations appear beside console.log statements

### Keyboard Shortcuts
- `Ctrl+Shift+L` - Start monitoring
- `Ctrl+Shift+K` - Clear output
- `Ctrl+Shift+W` - Show output

## Troubleshooting

### Common Issues

1. **Tests timeout**
   - Increase timeout with `this.timeout(ms)`
   - Check for async operations

2. **Extension not found**
   - Ensure extension is built (`yarn compile`)
   - Check extension manifest

3. **File system errors**
   - Verify test project exists
   - Check file permissions

### Debug Tips

- Use VS Code debugger for test debugging
- Add console.log statements for troubleshooting
- Check Output panel for test logs

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Key workflows covered
- **Edge Cases**: Error conditions handled
- **Regression Tests**: For bug fixes

---

For questions or issues with testing, check the main README.md or create an issue in the repository.
