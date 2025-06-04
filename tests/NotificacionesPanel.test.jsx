import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificacionesPanel from "../src/components/NotificacionesPanel";
import { useNotificaciones } from "../src/utils/NotificacionesContext";
import * as notificacionesStorage from "../src/utils/notificacionesStorage";
import toast from "react-hot-toast";

// Mock de react-hot-toast
jest.mock("react-hot-toast", () => {
  const toast = jest.fn();
  toast.success = jest.fn();
  return toast;
});

// Mock de NotificacionesContext
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: jest.fn(),
}));

// Mock de eliminarNotificacionStorage
jest.mock("../src/utils/notificacionesStorage", () => ({
  eliminarNotificacionStorage: jest.fn(),
}));

describe("<NotificacionesPanel />", () => {
  const setNotificaciones = jest.fn();
  const notificaciones = [
    { id: 1, mensaje: "Mensaje 1", tipo: "success" },
    { id: 2, mensaje: "Mensaje 2", tipo: "error" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useNotificaciones.mockReturnValue({ notificaciones, setNotificaciones });
  });

  test("renderiza el contador de notificaciones", () => {
    render(<NotificacionesPanel />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("abre el panel de notificaciones al hacer click en el botón", () => {
    render(<NotificacionesPanel />);
    const bellBtn = screen.getByRole("button", { name: "" }); // icon="bell"
    fireEvent.click(bellBtn);
    expect(screen.getByText(/Notificaciones