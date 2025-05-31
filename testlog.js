import { exec } from 'child_process';
import { mkdirSync, existsSync, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Determinar __dirname correctamente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

// Generar timestamp seguro para nombres de archivo
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Definir carpeta de logs y nombres de archivo
const logDir = join(_dirname, "logs/test-runs");
const logFile = join(logDir, `test-log-${timestamp}.log`);
const jsonFile = join(logDir, `test-report-${timestamp}.json`);

// Crear el directorio de logs si no existe
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Construir el comando para Vitest:
//  - --coverage ➞ generar coverage (lcov.info en coverage/)
//  - --json --outputFile=${jsonFile} ➞ generar JSON con resultados de tests
const cmd = `npx vitest run --coverage --json --outputFile=${jsonFile}`;

console.log(`🧪 Ejecutando Vitest...
🗂 Guardando log en: ${logFile}
📦 Guardando reporte JSON en: ${jsonFile}
`);

const stream = createWriteStream(logFile);
const child = exec(cmd);

// Redirigir stdout y stderr de Vitest hacia el archivo de log
child.stdout.pipe(stream);
child.stderr.pipe(stream);

child.on("exit", (code) => {
  console.log(`✅ Pruebas terminadas con código: ${code}`);
  if (code !== 0) {
    console.error(`⚠️ Vitest salió con código ${code}. Revisa ${logFile}`);
  }
});
