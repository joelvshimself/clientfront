import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificacionesProvider, useNotificaciones } from "../src/utils/NotificacionesContext";

jest.mock("../src/utils/notificacionesStorage", () => ({
  obtenerNotificaciones: jest.fn(() => ["Notificación 1", "Notificación 2"]),
}));

function TestComponent() {
  const { notificaciones, setNotificaciones } = useNotificaciones();

  return (
    <div>
      <ul>
        {notificaciones.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      <button onClick={() => setNotificaciones(["Nueva Notificación"])}>Actualizar</button>
    </div>
  );
}

describe("NotificacionesContext", () => {
  test("Carga notificaciones iniciales desde obtenerNotificaciones", () => {
    render(
      <NotificacionesProvider>
        <TestComponent />
      </NotificacionesProvider>
    );

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].textContent).toBe("Notificación 1");
  });

  test("Permite actualizar la lista de notificaciones usando setNotificaciones", async () => {
    render(
      <NotificacionesProvider>
        <TestComponent />
      </NotificacionesProvider>
    );

    const button = screen.getByRole("button", { name: /actualizar/i });

    await act(async () => {
      userEvent.click(button);
    });

    // Esperar que solo haya 1 elemento
    await screen.findByText("Nueva Notificación");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe("Nueva Notificación");
  });
});
