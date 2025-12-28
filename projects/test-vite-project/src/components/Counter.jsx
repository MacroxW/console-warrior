import { useState, useEffect } from 'preact/hooks';

export function Counter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);

  // Log de inicialización
  console.log('🔄 Counter component mounted');
  console.log('📊 Estado inicial del contador:', count);
  console.log('📋 Historial inicial:', history);

  useEffect(() => {
    console.log('🎯 useEffect ejecutado - contador actual:', count);
    
    // Simulación de carga inicial
    setTimeout(() => {
      console.log('⏰ Timeout ejecutado - preparando datos iniciales');
      console.info('ℹ️ Información: Componente Counter listo para usar');
    }, 1000);

    return () => {
      console.log('🧹 useEffect cleanup - contador final:', count);
    };
  }, [count]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Logs extensivos para cada acción
    console.log('➕ Botón incrementar clickeado');
    console.log('🔢 Nuevo valor:', newCount);
    console.info('ℹ️ Contador incrementado exitosamente');
    
    // Log de objeto complejo
    const logData = {
      action: 'increment',
      previousValue: count,
      newValue: newCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      performance: {
        memory: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
        timing: performance.timing ? performance.timing.loadEventEnd : 'N/A'
      }
    };
    
    console.log('📊 Datos detallados del incremento:', logData);
    console.table('📈 Tabla de datos:', logData);
    
    // Actualizar historial
    const newHistory = [...history, `+${newCount}`];
    setHistory(newHistory);
    console.log('📜 Historial actualizado:', newHistory);
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    
    console.log('➖ Botón decrementar clickeado');
    console.log('🔢 Nuevo valor:', newCount);
    console.warn('⚠️ Contador decrementado');
    
    // Log de advertencia cuando el contador es negativo
    if (newCount < 0) {
      console.warn('🚨 Advertencia: El contador es negativo!', newCount);
      console.error('❌ Error: Valor negativo detectado', { 
        value: newCount, 
        message: 'El contador no debería ser negativo' 
      });
    }
    
    const logData = {
      action: 'decrement',
      previousValue: count,
      newValue: newCount,
      isNegative: newCount < 0,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Datos detallados del decremento:', logData);
    
    const newHistory = [...history, `-${Math.abs(newCount)}`];
    setHistory(newHistory);
    console.log('📜 Historial actualizado:', newHistory);
  };

  const reset = () => {
    console.log('🔄 Botón reset clickeado');
    console.log('🔢 Valor anterior:', count);
    
    // Simulación de operación asíncrona
    setTimeout(() => {
      setCount(0);
      setHistory([]);
      console.log('✅ Contador reiniciado a 0');
      console.log('🧹 Historial limpiado');
      console.info('ℹ️ Operación de reinicio completada');
    }, 500);
  };

  const double = () => {
    const newCount = count * 2;
    setCount(newCount);
    
    console.log('✖️ Botón doblar clickeado');
    console.log('🔢 Valor anterior:', count);
    console.log('🔢 Nuevo valor (doblado):', newCount);
    console.info('ℹ️ Contador multiplicado por 2');
    
    // Log de grupo
    console.group('📊 Operación de doblado');
    console.log('Valor original:', count);
    console.log('Valor final:', newCount);
    console.log('Multiplicador:', 2);
    console.groupEnd();
  };

  const randomize = () => {
    const randomValue = Math.floor(Math.random() * 100);
    setCount(randomValue);
    
    console.log('🎲 Botón aleatorio clickeado');
    console.log('🔢 Nuevo valor aleatorio:', randomValue);
    console.info('ℹ️ Contador establecido a valor aleatorio');
    
    // Medición de tiempo
    console.time('⏱️ Operación de aleatorización');
    setTimeout(() => {
      console.timeEnd('⏱️ Operación de aleatorización');
    }, 100);
  };

  // Logs de renderizado
  console.debug('🎨 Componente Counter renderizado');
  console.trace('📍 Traza de renderizado');

  return (
    <div class="counter-container">
      <h2>🧪 Counter de Prueba para Console Warrior</h2>
      
      <div class="counter-display">
        <h3>Contador: {count}</h3>
        <p class="counter-info">Valor actual del contador para testing</p>
      </div>

      <div class="counter-controls">
        <button onClick={increment} class="btn btn-primary">
          + Incrementar
        </button>
        
        <button onClick={decrement} class="btn btn-secondary">
          - Decrementar
        </button>
        
        <button onClick={reset} class="btn btn-danger">
          🔄 Reset
        </button>
        
        <button onClick={double} class="btn btn-success">
          ✖️ Doble
        </button>
        
        <button onClick={randomize} class="btn btn-warning">
          🎲 Aleatorio
        </button>
      </div>

      <div class="counter-history">
        <h4>📜 Historial de Operaciones:</h4>
        {history.length > 0 ? (
          <ul>
            {history.map((item, index) => (
              <li key={index} class="history-item">
                Operación {index + 1}: {item}
              </li>
            ))}
          </ul>
        ) : (
          <p class="no-history">No hay operaciones aún</p>
        )}
      </div>

      <div class="counter-stats">
        <h4>📊 Estadísticas:</h4>
        <p>Valor actual: {count}</p>
        <p>Operaciones realizadas: {history.length}</p>
        <p>¿Es par?: {count % 2 === 0 ? 'Sí' : 'No'}</p>
        <p>¿Es positivo?: {count > 0 ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
}
