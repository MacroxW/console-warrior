// Test file for log capture functionality
function greetUser(name) {
    console.log('🚀 Application starting...');
    console.log('👤 User logged in');
    console.log('✅ Authentication successful');
    
    if (name) {
        console.log('🎉 Welcome back!');
        return `Hello, ${name}!`;
    }
    
    console.log('⚠️ No username provided');
    return 'Hello, Guest!';
}

// Test various console.log patterns
console.log('📋 Loading configuration...');
console.log('🔧 Setting up environment...');
console.log('💾 Database connected');

greetUser('Developer!');

console.log('🎯 Application ready to use!');
