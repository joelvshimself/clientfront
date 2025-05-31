// tests/App.selenium.test.js

import 'chromedriver';                  // Asegura que Selenium-WebDriver encuentre el binario de ChromeDriver
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

let driver;

beforeAll(
  async () => {
    // Configuramos Chrome en modo headless con los flags necesarios
    const options = new chrome.Options().addArguments(
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--window-size=1280,800'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  },
  60000 // espera hasta 60 seg para arrancar ChromeDriver
);

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

test(
  "App carga y muestra el logo de 'Carnes ViBa' en la página de Ventas",
  async () => {
    // 1) Navega a /venta (ajusta el puerto si tu servidor no corre en 5173)
    await driver.get('http://localhost:5173/venta');

    // 2) Espera hasta 5s a que aparezca el <img alt="Carnes ViBa">
    const logo = await driver.wait(
      until.elementLocated(By.css("img[alt='Carnes ViBa']")),
      5000
    );

    // 3) Verifica que el elemento <img> existe
    expect(logo).toBeDefined();
  },
  20000 // timeout máximo para este test: 20 segundos
);
