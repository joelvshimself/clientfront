// testlog.js

import { exec } from "child_process";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// --- 1) Obtenemos el directorio actual con ES Modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- 2) Timestamp para nombrar archivos de forma única:
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// --- 3) Definimos dónde guardaremos los logs:
const logDir = join(__dirname, "logs", "test-runs");
const logFile = join(logDir, `test-log-${timestamp}.log`);
const jsonFile = join(logDir, `test-report-${timestamp}.json`);

// --- 4) Creamos la carpeta si no existe:
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// --- 5) Comando para ejecutar Vitest con cobertura y generar reporte JSON (lcov + JSON):
//     - --coverage -> genera lcov.info en coverage/
//     - --reporter=json    --outputFile=... -> genera un JSON legible (usualmente para CI)
const cmd = `npx vitest run --coverage --reporter=json --outputFile=${jsonFile}`;

console.log(`🧪 Ejecutando Vitest con cobertura...
🗂 Guardando log en: ${logFile}
📦 Guardando reporte JSON en: ${jsonFile}
`);

const stream = createWriteStream(logFile);
const child = exec(cmd);

// --- 6) Redirigimos stdout y stderr a nuestro archivo de log:
child.stdout.pipe(stream);
child.stderr.pipe(stream);

child.on("exit", (code) => {
  console.log(`✅ Vitest / Coverage terminado con código: ${code}`);
  console.log(`   - Revisa ${logFile} para ver detalles del log.`);
  console.log(`   - JSON de cobertura: ${jsonFile}`);
  process.exit(code);
});
