import './style.css';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>🚀 Test Vite Project</h1>
    <div class="card">
      <p>
        This is a test project for the HelloWorld VS Code Extension! 
      </p>
      <p>
        Use this project to test:
      </p>
      <ul>
        <li>🔥 Start Vite Dev Server</li>
        <li>📋 Read Vite Logs</li>
        <li>✨ Text decorations beside code</li>
      </ul>
      <p>
        Edit <code>main.js</code> and save to test HMR
      </p>
    </div>
    <p class="read-the-docs">
      <a href="https://vitejs.dev" target="_blank">Learn more about Vite</a>
    </p>
  </div>
`;

console.log('🎉 Hello from Test Vite Project!');
console.log('🔍 Perfect for testing extension logs!');
console.log('⚡ HMR is ready to go!');
1