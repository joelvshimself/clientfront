// getCookie.test.js
import { getCookie } from "../src/utils/getCookie"; // ajusta la ruta

describe("getCookie", () => {
  const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");

  beforeEach(() => {
    // Mockear document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      configurable: true,
      value: "",
    });
  });

  afterEach(() => {
    // Restaurar document.cookie original para evitar efectos secundarios
    if (originalCookie) {
      Object.defineProperty(document, "cookie", originalCookie);
    }
  });

  it("debe retornar el valor de una cookie existente y decodificarla", () => {
    document.cookie = "usuario=Juan%20Perez; token=abc123";

    expect(getCookie("usuario")).toBe("Juan Perez");
    expect(getCookie("token")).toBe("abc123");
  });

  it("debe retornar null si la cookie no existe", () => {
    document.cookie = "foo=bar";

    expect(getCookie("noExiste")).toBeNull();
  });

  it("debe retornar null si hay error al decodificar la cookie", () => {
    // Simular cookie con valor mal codificado que lanza error en decodeURIComponent
    document.cookie = "bad=%E0%A4%A";

    // Espiar console.error para que no muestre error en la consola del test
    const spyError = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(getCookie("bad")).toBeNull();

    expect(spyError).toHaveBeenCalledWith(
      'Error decoding cookie "bad":',
      expect.any(URIError)
    );

    spyError.mockRestore();
  });
});
