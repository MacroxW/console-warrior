# Console Warrior Testing Guide 🥷

## How to Test Console Warrior Extension

### 1. Launch the Extension
- Press **F5** (or Run > Start Debugging)
- This opens a new VS Code window with Console Warrior loaded
- The test project should open automatically

### 2. Check Status Bar
- Look for the **"Warrior"** button in the bottom right status bar
- Click it to see the Console Warrior menu with options:
  - Start Console Warrior
  - Pause Console Warrior  
  - Show Output
  - Clear Output
  - Capture Current File

### 3. Test Log Decorations
**Method 1: Automatic**
- Open `main.js` (should happen automatically)
- Log decorations should appear beside console.log statements

**Method 2: Manual Trigger**
- Open any JavaScript file with console.log statements
- Press **Ctrl+Shift+L** to manually capture logs
- Or use Command Palette: "Console Warrior: Capture Console Logs"

**Method 3: Test Command**
- Open Command Palette (Ctrl+Shift+P)
- Run "Console Warrior: Test Console Warrior Decorations"

### 4. Keyboard Shortcuts
- **Ctrl+Shift+L**: Capture console logs in current file
- **Ctrl+Shift+K**: Clear log decorations  
- **Ctrl+Shift+W**: Open Console Warrior menu

### 5. Test Files
- `projects/test-vite-project/main.js` - Full test with many console.log examples
- `test-console-warrior.js` - Simple test file

### 6. Expected Behavior
✅ You should see decorations like: `🥷 Hello World!` beside console.log lines
✅ Status bar shows "Warrior" button with Console Ninja-style tooltip
✅ Menu provides Start/Pause/Show Output/Clear Output options
✅ F5 automatically opens main.js and starts Node.js with "Console Warrior is attached!"

### 7. Troubleshooting
- If decorations don't appear: Try Ctrl+Shift+L to manually trigger
- If status bar missing: Check if extension activated (should see welcome message)
- If errors: Check Output panel for Console Warrior logs

### 8. Running Node.js Test
```bash
cd projects/test-vite-project
yarn dev
```
This should show "🥷 Console Warrior is attached!" and run the console examples.
