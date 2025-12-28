// Utilidades de logging para Console Warrior testing

export class ConsoleWarriorLogger {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
  }

  // Métodos para diferentes niveles de log
  log(message, data = null) {
    const logEntry = this.createLogEntry('log', message, data);
    console.log('📝', message, data || '');
    this.addLog(logEntry);
    return logEntry;
  }

  info(message, data = null) {
    const logEntry = this.createLogEntry('info', message, data);
    console.info('ℹ️', message, data || '');
    this.addLog(logEntry);
    return logEntry;
  }

  warn(message, data = null) {
    const logEntry = this.createLogEntry('warn', message, data);
    console.warn('⚠️', message, data || '');
    this.addLog(logEntry);
    return logEntry;
  }

  error(message, data = null) {
    const logEntry = this.createLogEntry('error', message, data);
    console.error('❌', message, data || '');
    this.addLog(logEntry);
    return logEntry;
  }

  debug(message, data = null) {
    const logEntry = this.createLogEntry('debug', message, data);
    console.debug('🐛', message, data || '');
    this.addLog(logEntry);
    return logEntry;
  }

  trace(message, data = null) {
    const logEntry = this.createLogEntry('trace', message, data);
    console.trace('📍', message, data || '');
    this.addLog(logEntry);
    return logEntry;
  }

  // Métodos para logs especiales
  group(label, callback) {
    console.group(label);
    const result = callback();
    console.groupEnd();
    return result;
  }

  table(label, data) {
    console.log(`📋 ${label}:`);
    console.table(data);
  }

  time(label) {
    console.time(label);
  }

  timeEnd(label) {
    console.timeEnd(label);
  }

  timeLog(label, data = null) {
    console.timeLog(label, data);
  }

  // Creación de entradas de log
  createLogEntry(level, message, data) {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      component: 'ConsoleWarriorLogger',
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        performance: {
          now: performance.now(),
          memory: performance.memory ? performance.memory.usedJSHeapSize : null
        }
      }
    };
  }

  addLog(logEntry) {
    this.logs.push(logEntry);
    if (this.logs.length > 100) {
      this.logs.shift(); // Mantener solo los últimos 100 logs
    }
  }

  // Métodos para obtener logs
  getAllLogs() {
    return this.logs;
  }

  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  getLogsCount() {
    return this.logs.length;
  }

  clearLogs() {
    this.logs = [];
    console.log('🧹 Logs limpiados');
  }

  // Métodos para pruebas específicas
  generateTestLogs() {
    console.log('🧪 Generando logs de prueba...');
    
    this.log('Log básico de prueba');
    this.info('Información importante');
    this.warn('Advertencia de prueba');
    this.error('Error de prueba');
    this.debug('Mensaje de debug');
    
    // Logs con datos complejos
    const complexData = {
      user: { name: 'Test User', id: 123 },
      settings: { theme: 'dark', language: 'es' },
      timestamp: new Date().toISOString()
    };
    
    this.log('Datos complejos', complexData);
    this.table('Datos de usuario', [complexData.user]);
    
    // Logs agrupados
    this.group('Operación de prueba', () => {
      this.log('Paso 1: Inicio');
      this.info('Paso 2: Procesando');
      this.log('Paso 3: Finalizado');
    });
    
    // Medición de tiempo
    this.time('Operación de tiempo');
    setTimeout(() => {
      this.timeEnd('Operación de tiempo');
    }, 1000);
    
    console.log('✅ Logs de prueba generados');
  }

  simulateError() {
    try {
      throw new Error('Error simulado para Console Warrior');
    } catch (error) {
      this.error('Error capturado', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  }
}

// Instancia global para pruebas
export const warriorLogger = new ConsoleWarriorLogger();
