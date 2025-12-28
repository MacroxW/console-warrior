import { useState } from 'preact/hooks';
import { Counter } from './components/Counter';
import { Logger } from './components/Logger';
import './style.css';

export function App() {
  console.log('🚀 Console Warrior Test App iniciado');
  console.log('📅 Fecha de inicio:', new Date().toISOString());
  console.log('🔧 Versión de Node.js:', process.env.NODE_ENV || 'development');
  
  const [activeTab, setActiveTab] = useState('counter');

  console.log('📊 Estado inicial: activeTab =', activeTab);

  return (
    <div class="app">
      <header class="header">
        <h1>Console Warrior Test App</h1>
        <p>Testing log capture functionality with Vite + Preact</p>
      </header>

      <nav class="nav">
        <button 
          class={`tab ${activeTab === 'counter' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('counter');
            console.log('🔄 Cambiando a pestaña: Counter');
          }}
        >
          Counter
        </button>
        <button 
          class={`tab ${activeTab === 'logger' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('logger');
            console.log('🔄 Cambiando a pestaña: Logger');
          }}
        >
          Logger
        </button>
      </nav>

      <main class="main">
        {activeTab === 'counter' && <Counter />}
        {activeTab === 'logger' && <Logger />}
      </main>

      <footer class="footer">
        <p>💡 Usa tu extensión Console Warrior para capturar estos logs</p>
      </footer>
    </div>
  );
}
