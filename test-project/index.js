/**
 * Console Warrior Test Project
 * 
 * Run this file with Console Warrior to see logs appear inline in VS Code.
 * Use: Ctrl+Shift+R or "Console Warrior: Run File with Console Warrior"
 */

console.log('🚀 Console Warrior Test Project Started!');

// Basic logging
console.log('Hello, World!');
console.log('This is a simple message');

// Variables
const userName = 'Developer';
const projectName = 'Console Warrior';
console.log('Welcome', userName);
console.log('Project:', projectName);

// Objects and arrays
const user = { name: 'John', age: 30, role: 'Developer' };
const colors = ['red', 'green', 'blue'];
console.log('User object:', user);
console.log('Colors array:', colors);

// Different log types
console.info('ℹ️ This is an info message');
console.warn('⚠️ This is a warning message');
console.error('❌ This is an error message');
console.debug('🔍 This is a debug message');

// Function with logs
function calculateSum(a, b) {
    console.log(`Calculating sum of ${a} + ${b}`);
    const result = a + b;
    console.log('Result:', result);
    return result;
}

calculateSum(5, 3);
calculateSum(10, 20);

// Async operation
async function fetchData() {
    console.log('Starting data fetch...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Data fetched successfully!');
    return { data: 'Sample data', timestamp: new Date().toISOString() };
}

// Main execution
async function main() {
    console.log('=== Starting Demo ===');
    
    try {
        const data = await fetchData();
        console.log('Received data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
    
    // Loop
    console.log('Counting to 3:');
    for (let i = 1; i <= 3; i++) {
        console.log(`Count: ${i}`);
    }
    
    console.log('=== Demo Complete ===');
}

main();
