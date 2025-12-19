/**
 * Console Warrior Loader
 * 
 * This file is injected into Node.js applications using:
 * node --require ./loader/index.js your-app.js
 * 
 * It intercepts all console.* calls and writes them to a JSON file
 * that the VS Code extension reads to display logs inline.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const LOG_DIR = path.join(os.homedir(), '.console-warrior');
const LOG_FILE = path.join(LOG_DIR, 'logs.json');
const MAX_LOGS = 1000; // Prevent file from growing too large

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Store original console methods
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
};

// Log storage
let logs = [];
let logIndex = 0;

/**
 * Extract file and line number from stack trace
 * @returns {{ file: string, line: number } | null}
 */
function getCallerInfo() {
    const stack = new Error().stack;
    if (!stack) return null;

    const lines = stack.split('\n');
    
    // Skip first lines: Error, getCallerInfo, captureLog, console.* wrapper
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip internal Node.js modules and this loader
        if (line.includes('node:') || 
            line.includes('console-warrior/loader/index.js') ||
            line.includes('loader/index.js') ||
            line.includes('node_modules') ||
            line.includes('at getCallerInfo') ||
            line.includes('at captureLog') ||
            line.includes('at console.') ||
            line.trim() === 'Error') {
            continue;
        }

        // Match file path and line number
        // Formats: "at /path/to/file.js:10:5" or "at Object.<anonymous> (/path/to/file.js:10:5)"
        // Also handle: "at Context.<anonymous> (/path/to/file.js:10:5)"
        let match = line.match(/\(([^():]+):(\d+):\d+\)/);
        if (!match) {
            match = line.match(/at\s+([^():]+):(\d+):\d+/);
        }
        
        if (match) {
            const filePath = match[1].trim();
            // Skip if it's the loader itself
            if (filePath.includes('loader/index.js')) {
                continue;
            }
            return {
                file: filePath,
                line: parseInt(match[2], 10)
            };
        }
    }

    return null;
}

/**
 * Serialize value for JSON storage
 * @param {any} value 
 * @returns {string}
 */
function serialize(value) {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
    if (typeof value === 'symbol') return value.toString();
    if (value instanceof Error) {
        return `${value.name}: ${value.message}`;
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch {
            return '[Circular or non-serializable object]';
        }
    }
    return String(value);
}

/**
 * Capture a console call and write to log file
 * @param {'log' | 'error' | 'warn' | 'info' | 'debug'} type 
 * @param {any[]} args 
 */
function captureLog(type, args) {
    const callerInfo = getCallerInfo();
    const message = args.map(serialize).join(' ');

    const logEntry = {
        index: logIndex++,
        type,
        message,
        timestamp: new Date().toISOString(),
        file: callerInfo?.file || null,
        line: callerInfo?.line || null
    };

    logs.push(logEntry);

    // Trim logs if exceeding max
    if (logs.length > MAX_LOGS) {
        logs = logs.slice(-MAX_LOGS);
    }

    // Write to file (async to not block)
    try {
        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (err) {
        // Silently fail - don't disrupt the application
    }
}

/**
 * Create a wrapped console method
 * @param {'log' | 'error' | 'warn' | 'info' | 'debug'} type 
 * @returns {Function}
 */
function createWrapper(type) {
    return function (...args) {
        captureLog(type, args);
        originalConsole[type].apply(console, args);
    };
}

// Override console methods
console.log = createWrapper('log');
console.error = createWrapper('error');
console.warn = createWrapper('warn');
console.info = createWrapper('info');
console.debug = createWrapper('debug');

// Clear logs on startup
fs.writeFileSync(LOG_FILE, '[]');

// Export for testing
module.exports = {
    getCallerInfo,
    serialize,
    captureLog,
    LOG_FILE,
    LOG_DIR,
    _reset: () => {
        logs = [];
        logIndex = 0;
        fs.writeFileSync(LOG_FILE, '[]');
    },
    _getLogs: () => logs
};
