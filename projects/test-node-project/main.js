// Console Warrior Test Project
// This file demonstrates various console.log patterns for testing with Node.js

const fs = require('fs');
const path = require('path');

// Console Warrior log capture setup
const logFile = path.join(__dirname, '.console-warrior-logs.json');
let logIndex = 0;
const capturedLogs = [];

// Override console methods to capture logs
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

function getCallerLineNumber() {
    const stack = new Error().stack;
    if (!stack) return null;

    const stackLines = stack.split('\n');

    // Look for the actual caller, skipping internal functions
    for (const element of stackLines) {
        const line = element;
        if (line.includes('main.js')) {
            // Skip if it contains function names from our override system
            if (line.includes('captureLog') ||
                line.includes('console.log') ||
                line.includes('console.error') ||
                line.includes('console.warn') ||
                line.includes('console.info') ||
                line.includes('getCallerLineNumber')) {
                continue;
            }

            const match = line.match(/main\.js:(\d+):/);
            if (match) {
                const lineNum = parseInt(match[1], 10);
                // Additional check: skip the override function range (lines ~78-95)
                if (lineNum >= 78 && lineNum <= 95) {
                    continue;
                }
                return lineNum;
            }
        }
    }

    return null;
}

function captureLog(type, args) {
    const message = args.map(arg => {
        if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
        }
        return String(arg);
    }).join(' ');

    const lineNumber = getCallerLineNumber();

    const logEntry = {
        index: logIndex++,
        type: type,
        message: message,
        timestamp: new Date().toISOString(),
        lineNumber: lineNumber
    };

    capturedLogs.push(logEntry);

    // Write to file for Console Warrior to read
    try {
        fs.writeFileSync(logFile, JSON.stringify(capturedLogs, null, 2));
    } catch (error) {
        // Silently ignore file write errors to avoid disrupting the application
        originalError.call(console, 'Console Warrior: Failed to write log file:', error.message);
    }
}

// Clear previous logs
if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
}

// Override console methods to capture logs BEFORE any console statements
console.log = function (...args) {
    captureLog('log', args);
    originalLog.apply(console, args);
};
console.error = function (...args) {
    captureLog('error', args);
    originalError.apply(console, args);
};
console.warn = function (...args) {
    captureLog('warn', args);
    originalWarn.apply(console, args);
};
console.info = function (...args) {
    captureLog('info', args);
    originalInfo.apply(console, args);
};

console.log('🚀 Console Warrior Test Project Started!');

// Basic console logs
console.log('Hello, World!');
console.log('This is a simple message from Node.js');

// Variables and data
const userName = 'Developer';
const projectName = 'Console Warrior';
console.log('Welcome', userName);
console.log('Project:', projectName);

// Objects and arrays
const user = { name: 'John', age: 30, role: 'Developer' };
const colors = ['red', 'green', 'blue'];
console.log('User object:', user);
console.log('Colors array:', colors);

// Functions with console logs
function calculateSum(a, b) {
    console.log(`Calculating sum of ${a} + ${b}`);
    const result = a + b;
    console.log('Result:', result);
    return result;
}

// Error and warning logs
console.error('This is an !error message');
console.warn('This is a warning message');
console.info('This is an info message');

// Async operations with logs
async function fetchData() {
    console.log('Starting data fetch...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Data fetched successfully!');
    return { data: 'Sample data' };
}

// Main execution
async function main() {
    console.log('=== Starting Console Warrior Demo ===');

    // Call functions
    calculateSum(5, 3);

    // Async operations
    try {
        const data = await fetchData();
        console.log('Received data:', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    // Conditional logging
    const isDevelopment = true;
    if (isDevelopment) {
        console.log('Running in development mode');
    }

    // Loop with logs
    console.log('tasdo 6:');
    for (let i = 1; i <= 5; i++) {
        console.log(`Count: ${i}`);
    }

    console.log('=== Console Warrior Demo Complete ===');
}

// Run the demo
main().catch(console.error);
