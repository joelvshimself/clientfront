// tests/App.selenium.test.js

import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

describe("App Component (Selenium)", () => {
  let driver;

  // 1) Antes de todos los tests: instanciamos ChromeDriver
  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      // Para ejecutar en modo headless, descomenta la siguiente línea:
      // .setChromeOptions(new chrome.Options().headless())
      .build();
  }, 30000); // timeout de 30 s para que instale el driver

  // 2) Después de todos los tests: quitamos el driver
  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  }, 20000);

  test(
    "debe renderizar el logo con alt='Carnes ViBa'",
    async () => {
      // A) Navegamos a donde tu app React esté corriendo.
      //    Asegúrate de que `npm run preview` esté sirviendo en localhost:3000 (o cambia el puerto si es distinto).
      await driver.get("http://localhost:3000");

      // B) Esperamos hasta que aparezca un <img> cuyo atributo alt contenga "carnes viba" (ignorando mayúsculas/minúsculas).
      const logoImagen = await driver.wait(
        until.elementLocated(
          By.xpath(
            `//img[contains(
                translate(@alt,
                  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                  'abcdefghijklmnopqrstuvwxyz'),
                'carnes viba'
              )]`
          )
        ),
        10000 // timeout de 10 segundos
      );

      // C) Verificamos que efectivamente esté visible
      expect(await logoImagen.isDisplayed()).toBe(true);
    },
    20000 // timeout de 20 segundos para este test
  );
});
