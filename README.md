# HelloWorld VS Code Extension

A VS Code extension that allows you to add decorative text beside your code lines and manage Vite development projects.

## Features

### 🎨 Text Decorations

- **Add Text Beside Code**: Adds customizable text at the end of any code line
- **Clear Text Decorations**: Removes all text decorations from the editor
- Interactive text placement with visual feedback

### 🚀 Vite Project Management  

- **Start Vite Dev Server**: Launch a Vite development server in a dedicated terminal
- **Read Vite Logs**: Quick access to Vite terminal logs for debugging
- Smart terminal management and project path detection

### 📊 Log Capture & Display

- **Capture and Display Logs**: Automatically parse console.log statements and display their output as decorations beside the code
- **Clear Log Decorations**: Remove all log decorations from the current file
- **Generate Mock Logs**: Create test log entries for demonstration and testing purposes
- **Real-time Log Monitoring**: Advanced log tracking with timestamp information

### 📁 Welcome File

- Automatic welcome file opening when extension activates
- Helpful documentation and command reference

## Installation

### Development Setup

1. Clone or download this extension project
2. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

3. Compile the TypeScript source:

   ```bash
   yarn compile
   ```

4. Press `F5` to open a new VS Code window with the extension loaded

### From Source

```bash
# Using the provided Makefile
make install
make build
make debug
```

## Commands

All commands are available through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Hello World` | Display a simple greeting message |
| `Add Text Beside Code` | Add decorative text at the end of the current line |
| `Clear Text Beside Code` | Remove all text decorations from the editor |
| `Start Vite Dev Server` | Launch Vite development server in terminal |
| `Read Vite Logs` | Focus on Vite terminal to view logs |
| `Capture and Display Logs` | Parse console.log statements and show output beside code |
| `Clear Log Decorations` | Remove all log decorations from the current file |
| `Generate Mock Logs` | Create test log entries for demonstration |

## Usage

### Adding Text Decorations

1. Place your cursor on any line of code
2. Open Command Palette (`Ctrl+Shift+P`)
3. Run "Add Text Beside Code"
4. See the decorative text appear at the end of the line

### Capturing Console Logs

1. Open a JavaScript/TypeScript file with `console.log` statements
2. Run "Capture and Display Logs" command
3. See log outputs displayed beside each `console.log` line with timestamps
4. Use "Clear Log Decorations" to remove log displays

### Managing Vite Projects

1. Use "Start Vite Dev Server" command
2. Enter the path to your Vite project when prompted
3. The extension will create a dedicated terminal and start the dev server
4. Use "Read Vite Logs" to quickly access the terminal output

## Configuration

The extension uses the following default settings for text decorations:

```typescript
{
  contentText: ' // Your text here',
  color: '#888888',
  fontStyle: 'italic'
}
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- VS Code

### Build Commands

```bash
# Install dependencies
yarn install

# Compile TypeScript
yarn compile

# Watch mode for development
yarn watch

# Run linting
yarn lint

# Run tests
yarn test
```

### Using Makefile

```bash
# Install dependencies
make install

# Build the extension
make build

# Start development with watch mode
make dev

# Debug the extension
make debug

# Clean build artifacts
make clean

# Run all quality checks
make check
```

## Project Structure

```
├── src/
│   ├── extension.ts          # Main extension logic
│   ├── commands/
│   │   └── viteManager.ts    # Vite project management
│   └── test/
│       └── extension.test.ts # Test suite
├── projects/
│   └── test-vite-project/    # Test project for debugging
├── .vscode/
│   ├── launch.json          # Debug configuration
│   ├── settings.json        # Workspace settings
│   └── tasks.json           # Build tasks
├── package.json             # Extension manifest
├── tsconfig.json            # TypeScript configuration
├── Makefile                 # Build automation
└── README.md               # This file
```

## Development & Testing

### Debug Mode Setup

When you press **F5** to start debugging, the extension will automatically:

1. Compile the TypeScript source
2. Open a new VS Code window with the extension loaded
3. Open the test Vite project located in `projects/test-vite-project/`

This setup allows you to immediately test:

- 🚀 **Start Vite Dev Server** (auto-suggests the test project path)
- 📋 **Read Vite Logs** (terminal management)
- ✨ **Text decorations** (add text beside code lines)

### Testing Commands

1. **F5** - Start debugging (opens test project automatically)
2. **Ctrl+Shift+P** → "Start Vite Dev Server" - Uses test project by default
3. **Ctrl+Shift+P** → "Add Text Beside Code" - Test on any file
4. **Ctrl+Shift+P** → "Read Vite Logs" - Focus Vite terminal

## Known Issues

- Text decorations persist across VS Code sessions (by design)
- Vite terminal management requires manual path input
- Extension activates on VS Code startup (opens welcome file automatically)

## Release Notes

### 1.0.0

- Initial release with text decoration functionality
- Added Vite project management commands
- Implemented welcome file system
- Full Yarn support for development workflow

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature description"`
5. Push to your branch: `git push origin feature-name`
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions:

- Open an issue on the project repository
- Check existing documentation in the `vsc-extension-quickstart.md` file
- Review VS Code extension development guidelines

---

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Yarn Documentation](https://yarnpkg.com/getting-started)
- [Vite Documentation](https://vitejs.dev/guide/)

**Happy coding! 🚀**
