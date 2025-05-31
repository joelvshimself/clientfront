// tests/App.selenium.test.js
import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import path from "path";
import os from "os";

let driver;

beforeAll(
  async () => {
    // Creamos un directorio temporal único para Chrome
    const userDataDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}`);

    // Configuramos Chrome en modo headless
    const options = new chrome.Options()
      .addArguments("--headless=new")           // Usa nuevo headless mode
      .addArguments("--no-sandbox")              // Requerido en algunos entornos CI
      .addArguments("--disable-dev-shm-usage")   // Mejora estabilidad en contenedores
      .addArguments(`--user-data-dir=${userDataDir}`);

    // Construimos el WebDriver para Chrome
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  },
  20000 // Timeout para la creación del driver (hasta 20s)
);

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

// Si quieres ejecutar localmente, quita el ".skip".
// Para CI, mantenlo así para que no falle en GitHub Actions.
test.skip(
  "App Component (Selenium) → debe renderizar '¡Bienvenido a Logiviba!'",
  async () => {
    // Asegúrate de levantar tu App localmente en http://localhost:3000 (npm run dev)
    await driver.get("http://localhost:3000");

    // Busca el elemento que contenga el texto. Ajusta la XPATH si tu heading es distinto.
    const element = await driver.findElement(
      By.xpath("//*[contains(text(), '¡Bienvenido a Logiviba!')]")
    );
    expect(element).toBeDefined();
  },
  30000 // Timeout del test (30s)
);
