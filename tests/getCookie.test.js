// getCookie.test.js
import { getCookie } from '../src/utils/getCookie';

describe('getCookie', () => {
  beforeEach(() => {
    // Limpiar cookies antes de cada test
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  test('devuelve el valor decodificado de la cookie existente', () => {
    // Simula cookies
    document.cookie = 'test=hello%20world; other=123';

    const result = getCookie('test');
    expect(result).toBe('hello world');
  });

  test('devuelve null si la cookie no existe', () => {
    document.cookie = 'foo=bar';
    const result = getCookie('nonexistent');
    expect(result).toBeNull();
  });

  test('captura error si decodeURIComponent lanza excepción y devuelve null', () => {
    document.cookie = 'bad=%E0%A4%A';

    // Espía console.error para que no ensucie test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = getCookie('bad');
    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error decoding cookie "bad":'),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
