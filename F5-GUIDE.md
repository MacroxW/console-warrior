# 🥷 Console Warrior F5 Guide

## Cómo usar F5 para lanzar Console Warrior

### Pasos para probar Console Warrior:

1. **Abrir VS Code en el directorio principal**
   ```bash
   cd /media/macrox/DFiles/Projects/console-warrior
   code .
   ```

2. **Presionar F5 (o Ctrl+F5)**
   - Se abrirá una nueva ventana de VS Code
   - La extensión Console Warrior se cargará en modo desarrollo
   - Se abrirá automáticamente el archivo `projects/test-vite-project/main.js`

3. **En la nueva ventana de VS Code:**
   - Verás el botón "Warrior" en la barra de estado (esquina inferior derecha)
   - El archivo `main.js` estará abierto con varios `console.log` statements

4. **Iniciar el monitoreo de logs:**
   - Haz clic en el botón "Warrior" en la barra de estado
   - Selecciona "Start Console Warrior"
   - Abre una terminal en VS Code (Ctrl+Shift+`)
   - Ejecuta: `yarn dev`

5. **Ver los logs en tiempo real:**
   - Los logs aparecerán al lado de cada `console.log` statement
   - Verás algo como: `console.log('Hello, World!'); 🥷 Hello, World!`

### Atajos de teclado útiles:
- `Ctrl+Shift+L`: Capturar logs manualmente
- `Ctrl+Shift+K`: Limpiar decoraciones
- `Ctrl+Shift+W`: Abrir menú Console Warrior

### Solución de problemas:

Si F5 no funciona:
1. Ejecuta `npm run compile` para compilar la extensión
2. Verifica que existe el archivo `out/extension.js`
3. Ejecuta `./test-f5.sh` para probar manualmente

### Estados del botón Warrior:
- **Verde**: Console Warrior activo, monitoreando logs
- **Amarillo**: Console Warrior pausado
- **Tooltip**: Muestra información detallada al pasar el mouse
