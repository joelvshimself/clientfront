import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import TwoFAScreen from "../src/components/TwoFAScreen";
import { BrowserRouter } from "react-router-dom";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("TwoFAScreen", () => {
  test("renderiza correctamente el formulario inicial sin QR", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ twoFAEnabled: false }),
    });

    renderWithRouter(<TwoFAScreen />);

    expect(await screen.findByText(/Presiona para generar tu código QR/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generar QR/i })).toBeInTheDocument();
  });

  test("renderiza mensaje cuando ya está activado (yaActivado)", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ twoFAEnabled: true }),
    });

    renderWithRouter(<TwoFAScreen />);

    expect(await screen.findByText(/Ya tienes activado Google Authenticator/i)).toBeInTheDocument();
  });

  test("genera el QR cuando se hace clic en Generar QR", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ twoFAEnabled: false }),
    });

    renderWithRouter(<TwoFAScreen />);

    const generateBtn = await screen.findByText(/Generar QR/i);

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ qr: "http://fake-qr.png" }),
    });

    fireEvent.click(generateBtn);

    expect(await screen.findByAltText(/Escanea el código/i)).toHaveAttribute("src", "http://fake-qr.png");
  });

  test("verifica el código correctamente (éxito) y llama a window.location.reload", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ twoFAEnabled: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ qr: "http://qr.png" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

    // Guardamos el reload original para restaurarlo después
    const originalReload = window.location.reload;

    // Mockeamos solo el método reload sin reemplazar window.location completo
    Object.defineProperty(window.location, "reload", {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });

    renderWithRouter(<TwoFAScreen />);

    fireEvent.click(await screen.findByText(/Generar QR/i));
    await screen.findByAltText(/Escanea el código/i);

    fireEvent.change(screen.getByPlaceholderText(/Código de 6 dígitos/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText(/Verificar Código/i));

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });

    // Restauramos reload original para no afectar otros tests
    window.location.reload = originalReload;
  });

  test("muestra alerta si el código es incorrecto", async () => {
    window.alert = jest.fn();

    fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ twoFAEnabled: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ qr: "http://qr.png" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: false }),
      });

    renderWithRouter(<TwoFAScreen />);

    fireEvent.click(await screen.findByText(/Generar QR/i));
    await screen.findByAltText(/Escanea el código/i);

    fireEvent.change(screen.getByPlaceholderText(/Código de 6 dígitos/i), {
      target: { value: "000000" },
    });

    fireEvent.click(screen.getByText(/Verificar Código/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("❌ Código incorrecto");
    });
  });
});
