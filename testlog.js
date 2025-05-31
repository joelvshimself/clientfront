// testlog.js
import { exec } from "child_process";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Obtén el directorio actual usando ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Timestamp con formato seguro para nombres de archivo
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Define directorio y archivos de salida
const logDir = join(__dirname, "/logs/test-runs");
const logFile = join(logDir, `test-log-${timestamp}.log`);
const jsonFile = join(logDir, `test-report-${timestamp}.json`);

// Crea el directorio si no existe
if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

// Comando para correr Jest (en backend) o Vitest (en front). Aquí ejemplo con Vitest:
const cmd = `npx vitest run --coverage --reporter=json --outputFile=${jsonFile}`;

console.log(`🧪 Ejecutando pruebas Vitest...
🗂 Guardando log en: ${logFile}
📦 Guardando reporte JSON en: ${jsonFile}
`);

const stream = createWriteStream(logFile);
const child = exec(cmd);

// Redirige stdout y stderr al log
child.stdout.pipe(stream);
child.stderr.pipe(stream);

child.on("exit", (code) => {
  console.log(`✅ Pruebas terminadas con código: ${code}`);
});
