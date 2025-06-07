# Console Warrior 🥷

**Dynamic Logging Made Simple & Free** ⚡

A powerful VS Code extension that brings dynamic log visualization directly to your code - like Console Ninja, but completely open source and free! See your `console.log` outputs right beside your code in real-time, without switching between your editor and browser console.

> 🎯 **Mission**: Democratize advanced logging tools for every developer, regardless of budget.

## Why Console Warrior?

- ✅ **100% Free & Open Source** - No subscriptions, no limits
- 🚀 **Real-time Log Visualization** - See outputs directly in your editor
- 🎨 **Beautiful UI** - Clean, modern interface with syntax highlighting
- ⚡ **Zero Configuration** - Works out of the box
- 🔧 **Extensible** - Built for the community, by the community

## ✨ Core Features

### 🎯 Dynamic Log Visualization

- **Real-time Console Output** - See `console.log` results directly beside your code
- **Multi-console Support** - `console.warn`, `console.info`, `console.debug`, and more
- **Timestamp Tracking** - Know exactly when each log was executed
- **Smart Log Parsing** - Automatically detects and displays log outputs

### 🎨 Code Enhancement

- **Interactive Decorations** - Add custom text beside any code line
- **Syntax Highlighting** - Beautiful, color-coded log displays
- **Quick Actions** - Clear decorations with a single command

### 🚀 Development Workflow

- **Vite Integration** - Built-in Vite development server management
- **Terminal Management** - Smart terminal handling for seamless development
- **Mock Data Generation** - Create test logs for demonstration and testing

### 📁 Developer Experience

- **Zero Config Setup** - Works immediately after installation
- **Automatic Welcome Guide** - Get started in seconds
- **Command Palette Integration** - All features accessible via `Ctrl+Shift+P`

## 🗺️ Roadmap

### 🎯 Core Features (In Development)

- [x] **Console Logs** ✨  
  Output from `console.log` displayed in your editor next to the relevant line of code. No more context switching to browser dev tools or terminal output.

- [ ] **Runtime Errors** 🚨  
  Runtime error output displayed in your editor next to the relevant line of code. Catch exceptions and errors exactly where they happen.

- [ ] **Network Requests** 🌐  
  Network logging captures details of requests made by your browser to your application. Only requests related to files currently opened in your editor are logged. Shows URL, method (GET, POST), and status (200, 404, 500) right next to your code.

### 🔮 Future Enhancements

- [ ] **Enhanced Console Methods** - Support for `console.warn`, `console.info`, `console.debug`
- [ ] **Log Filtering & Search** - Real-time filtering and search capabilities
- [ ] **Performance Monitoring** - Track execution times and performance metrics
- [ ] **WebSocket Support** - Real-time connection monitoring
- [ ] **Custom Log Formatters** - Personalized output styling

> 🚀 **Current Focus**: Getting the core trio of features rock-solid before expanding!

## 🚀 Quick Start

### One-Click Installation (Coming Soon)

- Install from VS Code Marketplace: `Console Warrior`
- Press `F5` to see it in action!

### Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/console-warrior.git
   cd console-warrior
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Launch in development mode:**

   ```bash
   yarn compile
   # Press F5 in VS Code to open extension host
   ```

### From Source

```bash
# Using the provided Makefile
make install
make build  
make debug
```

## 🎬 See It In Action

### Before Console Warrior

```javascript
console.log('🚀 Loading user data...');
// Switch to browser console to see: "🚀 Loading user data..."
// Switch back to editor...
// Switch to console again...
// 😤 Constant context switching!
```

### After Console Warrior ✨

```javascript
console.log('🚀 Loading user data...'); // → 🚀 Loading user data... [12:34:56.789]
console.log('✅ User loaded:', user);    // → ✅ User loaded: {name: "John", id: 123} [12:34:56.821]
console.warn('⚠️ Cache miss');           // → ⚠️ Cache miss [12:34:56.825]
```

**The magic**: All outputs appear right beside your code, in real-time! 🪄

### Demo Video
>
> 🎥 Coming soon: Watch Console Warrior in action!

---

## 🎮 How to Use

### 1. Dynamic Log Visualization

```javascript
function greetUser(name) {
    console.log('🚀 Application starting...'); // ← You'll see output here!
    console.log('👤 User logged in');
    
    if (name) {
        console.log('🎉 Welcome back!');
        return `Hello, ${name}!`;
    }
    
    console.log('⚠️ No username provided');
    return 'Hello, Guest!';
}
```

**Steps:**

1. Open any JavaScript/TypeScript file with `console.log` statements
2. Run command: `Ctrl+Shift+P` → "Capture and Display Logs"
3. Watch the magic happen! ✨

### 2. Custom Text Decorations

1. Place cursor on any line
2. `Ctrl+Shift+P` → "Add Text Beside Code"  
3. See decorative text appear instantly

### 3. Vite Project Management

1. `Ctrl+Shift+P` → "Start Vite Dev Server"
2. Enter your project path
3. Integrated terminal management with log viewing

## 🆚 Console Warrior vs Alternatives

| Feature | Console Warrior | Console Ninja | Browser DevTools |
|---------|----------------|---------------|------------------|
| **Price** | 🆓 **Free Forever** | 💰 Paid subscription | 🆓 Free |
| **In-Editor Logs** | ✅ Real-time | ✅ Real-time | ❌ Separate window |
| **Open Source** | ✅ MIT License | ❌ Proprietary | ❌ Browser-specific |
| **No Setup** | ✅ Zero config | ✅ Easy setup | ⚠️ Manual steps |
| **Offline Work** | ✅ Always works | ✅ Works offline | ✅ Browser dependent |
| **Custom Extensions** | ✅ Community driven | ❌ Limited | ❌ No customization |
| **Multi-Framework** | ✅ Universal | ✅ Multiple | ⚠️ Framework dependent |

**🎯 Our Mission**: Bring Console Ninja's amazing UX to everyone, for free!

## 📋 Available Commands

All commands are accessible through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

| Command | Description | Status |
|---------|-------------|--------|
| `Capture and Display Logs` | 🎯 Parse console.log statements and show output beside code | ✅ Active |
| `Clear Log Decorations` | 🧹 Remove all log decorations from the current file | ✅ Active |
| `Generate Mock Logs` | 🎭 Create test log entries for demonstration | ✅ Active |
| `Add Text Beside Code` | ✏️ Add decorative text at the end of the current line | ✅ Active |
| `Clear Text Beside Code` | 🗑️ Remove all text decorations from the editor | ✅ Active |
| `Start Vite Dev Server` | 🚀 Launch Vite development server in terminal | ✅ Active |
| `Read Vite Logs` | 📖 Focus on Vite terminal to view logs | ✅ Active |

> 💡 **Tip**: Most commands work immediately without configuration!

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

## 🤝 Contributing

Console Warrior is built by developers, for developers! We welcome contributions of all kinds.

### Ways to Contribute

- 🐛 **Report bugs** - Found something broken? Let us know!
- 💡 **Suggest features** - Have ideas for new logging capabilities?
- 🔧 **Submit PRs** - Code contributions are always welcome
- 📖 **Improve docs** - Help make the documentation clearer
- ⭐ **Star the repo** - Show your support!

### Development Workflow

1. **Fork & Clone**

   ```bash
   git clone https://github.com/yourusername/console-warrior.git
   cd console-warrior
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Develop & Test**

   ```bash
   yarn install
   yarn compile
   # Press F5 to test in VS Code Extension Host
   ```

4. **Submit PR**

   ```bash
   git commit -m "feat: add amazing new feature"
   git push origin feature/amazing-new-feature
   # Open PR on GitHub
   ```

### 🎯 Good First Issues

Looking for easy ways to contribute? Check out issues labeled:

- `good-first-issue` - Perfect for newcomers
- `help-wanted` - Community assistance needed
- `documentation` - Improve our docs

> **Pro tip**: Join our discussions to connect with other contributors!

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use, modify, and distribute this software freely. We just ask that you include the original license notice.

## 💬 Community & Support

### Get Help

- 📚 **Documentation** - Check our [Wiki](https://github.com/yourusername/console-warrior/wiki)
- 🐛 **Bug Reports** - [Open an issue](https://github.com/yourusername/console-warrior/issues)
- 💬 **Discussions** - [Join the conversation](https://github.com/yourusername/console-warrior/discussions)
- 📧 **Email** - For security issues: <security@console-warrior.dev>

### Follow the Project

- ⭐ **GitHub** - Star us for updates
- 🐦 **Twitter** - Follow [@ConsoleWarrior](https://twitter.com/consolewarrior)
- 📝 **Blog** - Read our [development updates](https://console-warrior.dev/blog)

---

## 🙏 Acknowledgments

Special thanks to:

- 🥷 **Console Ninja** team for inspiration
- 🎨 **VS Code team** for the amazing extension API  
- 💖 **Open Source community** for making this possible
- 🚀 **All contributors** who make this project better

---

## 📚 Resources & Links

- [VS Code Extension API Documentation](https://code.visualstudio.com/api)
- [Extension Development Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)  
- [Yarn Package Manager](https://yarnpkg.com/getting-started)
- [Vite Build Tool](https://vitejs.dev/guide/)

---

<div align="center">

**Made with ❤️ by MacroxW, for developers**

[⭐ Star us on GitHub](https://github.com/yourusername/console-warrior) • [🚀 Try it now](https://marketplace.visualstudio.com/items?itemName=console-warrior) • [💬 Join the community](https://github.com/yourusername/console-warrior/discussions)

</div>
