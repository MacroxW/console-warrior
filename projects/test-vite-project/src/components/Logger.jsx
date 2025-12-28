import { useState, useEffect } from 'preact/hooks';

export function Logger() {
  const [logLevel, setLogLevel] = useState('log');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    console.log('📝 Logger component mounted');
    console.info('ℹ️ Logger listo para generar diferentes tipos de logs');
  }, []);

  const generateLog = (level) => {
    const timestamp = new Date().toISOString();
    const message = `Log de nivel ${level} generado a las ${timestamp}`;
    
    // Diferentes tipos de logs según el nivel
    switch (level) {
      case 'log':
        console.log('📝', message);
        break;
      case 'info':
        console.info('ℹ️', message);
        break;
      case 'warn':
        console.warn('⚠️', message);
        break;
      case 'error':
        console.error('❌', message);
        break;
      case 'debug':
        console.debug('🐛', message);
        break;
      case 'trace':
        console.trace('📍', message);
        break;
      default:
        console.log('📝', message);
    }

    // Log de objeto complejo
    const logData = {
      level: level,
      message: message,
      timestamp: timestamp,
      component: 'Logger',
      metadata: {
        userAgent: navigator.userAgent,
        location: window.location.href,
        performance: {
          now: performance.now(),
          navigation: performance.navigation ? performance.navigation.type : 'N/A'
        }
      }
    };

    console.log('📊 Datos del log:', logData);
    setLogs(prev => [...prev, logData]);
  };

  const generateGroupedLogs = () => {
    console.log('🎯 Generando logs agrupados...');
    
    console.group('📦 Grupo de logs de operación');
    console.log('1️⃣ Inicio de operación');
    console.info('2️⃣ Procesando datos...');
    
    // Simulación de procesamiento
    setTimeout(() => {
      console.log('3️⃣ Procesamiento completado');
      console.info('4️⃣ Resultado exitoso');
      console.groupEnd();
      console.log('✅ Grupo de logs finalizado');
    }, 500);
  };

  const generateTableLog = () => {
    const data = [
      { nombre: 'Juan', edad: 25, ciudad: 'Madrid' },
      { nombre: 'María', edad: 30, ciudad: 'Barcelona' },
      { nombre: 'Pedro', edad: 28, ciudad: 'Valencia' }
    ];
    
    console.log('📋 Generando tabla de datos...');
    console.table('Usuarios:', data);
  };

  const generateTimeLogs = () => {
    console.time('⏱️ Medición de tiempo');
    
    // Simulación de operación
    setTimeout(() => {
      console.timeLog('⏱️ Medición de tiempo', 'Paso intermedio completado');
      
      setTimeout(() => {
        console.timeEnd('⏱️ Medición de tiempo', 'Operación finalizada');
      }, 500);
    }, 1000);
  };

  const generateConditionalLogs = () => {
    const random = Math.random();
    
    console.log('🎲 Generando logs condicionales...');
    
    if (random > 0.7) {
      console.log('✅ Condición A: Valor alto detectado');
      console.info('ℹ️ Detalles de la condición A');
    } else if (random > 0.3) {
      console.warn('⚠️ Condición B: Valor medio detectado');
      console.warn('⚠️ Posible advertencia');
    } else {
      console.error('❌ Condición C: Valor bajo detectado');
      console.error('❌ Error en la condición C');
    }
  };

  const generateErrorLogs = () => {
    console.log('🚨 Generando logs de error...');
    
    try {
      throw new Error('Error de prueba para Console Warrior');
    } catch (error) {
      console.error('❌ Error capturado:', error.message);
      console.error('📋 Stack trace:', error.stack);
      
      // Error con objeto complejo
      const errorData = {
        error: error.message,
        timestamp: new Date().toISOString(),
        component: 'Logger',
        stack: error.stack,
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      };
      
      console.error('📊 Datos del error:', errorData);
    }
  };

  const clearLogs = () => {
    console.log('🧹 Limpiando logs...');
    setLogs([]);
    console.log('✅ Logs limpiados exitosamente');
  };

  return (
    <div class="logger-container">
      <h2>🧪 Logger de Prueba para Console Warrior</h2>
      
      <div class="logger-controls">
        <h3>🎯 Generar Logs por Nivel:</h3>
        <div class="log-buttons">
          <button onClick={() => generateLog('log')} class="btn btn-info">
            📝 Log
          </button>
          <button onClick={() => generateLog('info')} class="btn btn-primary">
            ℹ️ Info
          </button>
          <button onClick={() => generateLog('warn')} class="btn btn-warning">
            ⚠️ Warn
          </button>
          <button onClick={() => generateLog('error')} class="btn btn-danger">
            ❌ Error
          </button>
          <button onClick={() => generateLog('debug')} class="btn btn-secondary">
            🐛 Debug
          </button>
          <button onClick={() => generateLog('trace')} class="btn btn-dark">
            📍 Trace
          </button>
        </div>
      </div>

      <div class="logger-controls">
        <h3>📊 Tipos Especiales de Logs:</h3>
        <div class="special-buttons">
          <button onClick={generateGroupedLogs} class="btn btn-success">
            📦 Logs Agrupados
          </button>
          <button onClick={generateTableLog} class="btn btn-info">
            📋 Tabla de Datos
          </button>
          <button onClick={generateTimeLogs} class="btn btn-primary">
            ⏱️ Medición de Tiempo
          </button>
          <button onClick={generateConditionalLogs} class="btn btn-warning">
            🎲 Logs Condicionales
          </button>
          <button onClick={generateErrorLogs} class="btn btn-danger">
            🚨 Logs de Error
          </button>
        </div>
      </div>

      <div class="logger-stats">
        <h3>📈 Estadísticas de Logs:</h3>
        <p>Total de logs generados: {logs.length}</p>
        <p>Último log: {logs.length > 0 ? logs[logs.length - 1].level : 'Ninguno'}</p>
      </div>

      <div class="logger-actions">
        <button onClick={clearLogs} class="btn btn-danger">
          🧹 Limpiar Logs
        </button>
      </div>

      <div class="logger-instructions">
        <h4>💡 Instrucciones para Console Warrior:</h4>
        <ul>
          <li>Usa los botones para generar diferentes tipos de logs</li>
          <li>Prueba los logs agrupados para ver cómo maneja grupos</li>
          <li>Genera logs de error para testear captura de errores</li>
          <li>Usa la tabla para testear logs de datos estructurados</li>
          <li>Prueba la medición de tiempo para logs temporales</li>
        </ul>
      </div>
    </div>
  );
}
