// scripts/run-frontend-tests.js

import { exec } from "child_process";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";

// 1) Ruta de la carpeta donde guardaremos logs y reports
const logDir = "./logs/test-runs";

// 2) Si la carpeta no existe, créala (recursively)
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// 3) Generamos un timestamp (ISO con ":" y "." reemplazados por "-")
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//    Ejemplo de resultado: "2025-05-31T19-53-37-959Z"

// 4) Armamos las rutas de los dos archivos que vamos a crear:
const jsonFile = join(logDir, `test-report-${timestamp}.json`);
const logFile = join(logDir, `test-log-${timestamp}.log`);

// 5) Definimos el comando de Jest. 
//    - --coverage para generar informe de cobertura.
//    - --json para que Jest devuelva salida JSON.
//    - --outputFile=<rutaJSON> para indicarle dónde escribir ese JSON.
const cmd = `npx jest --coverage --json --outputFile=${jsonFile}`;

// 6) Informamos en consola qué vamos a hacer
console.log(
  `🧪 Ejecutando pruebas Jest…
📦 Reporte JSON: ${jsonFile}
📜 Log de consola: ${logFile}\n`
);

// 7) Abrimos un write stream hacia el archivo logFile
const stream = createWriteStream(logFile, { flags: "a" });

// 8) Ejecutamos Jest con exec(). El callback se disparará al terminar.
const child = exec(cmd, (error, stdout, stderr) => {
  // 8a) Imprimir en consola lo que Jest envíe por stdout o stderr
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  if (error) console.error(`❌ Error al ejecutar Jest: ${error.message}`);
});

// 9) Mientras Jest corre, redirigimos stdout y stderr al archivo .log
if (child.stdout) child.stdout.pipe(stream);
if (child.stderr) child.stderr.pipe(stream);

// 10) Al terminar el proceso (evento 'exit'), mostramos mensaje final
child.on("exit", (code) => {
  console.log(`✅ Pruebas finalizadas con código: ${code}`);
  console.log(`   - Ruta del .log : ${logFile}`);
  console.log(`   - Ruta del .json: ${jsonFile}`);
});
