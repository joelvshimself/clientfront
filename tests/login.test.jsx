import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../src/components/login";

// Mock de dependencias externas
jest.mock("@ui5/webcomponents-react", () => ({
  Input: (props) => <input {...props} data-testid={props.name} />,
  Button: (props) => <button {...props}>{props.children}</button>,
  Link: (props) => <a {...props}>{props.children}</a>,
  Title: (props) => <h2>{props.children}</h2>,
  Text: (props) => <span>{props.children}</span>,
  FlexBox: (props) => <div>{props.children}</div>,
  FlexBoxDirection: { Row: "row", Column: "column" },
}));

jest.mock("@mui/icons-material/Google", () => () => <span>GoogleIcon</span>);
jest.mock("@mui/material", () => ({
  Button: (props) => <button {...props}>{props.children}</button>,
}));

jest.mock("../src/utils/useAuth", () => ({
  useAuth: () => ({ setUser: jest.fn() }),
}));

const mockLogin = jest.fn();
jest.mock("../src/services/authService", () => ({
  login: (...args) => mockLogin(...args),
  getUserInfo: jest.fn(),
}));

describe("<Login />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el formulario de login", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  test("permite escribir email y contraseña", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);

    fireEvent.input(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.input(passwordInput, { target: { value: "123456" } });

    expect(emailInput).toHaveValue("test@correo.com");
    expect(passwordInput).toHaveValue("123456");
  });

  test("muestra error si login falla", async () => {
    mockLogin.mockResolvedValueOnce({ success: false });
    render(<Login />);
    fireEvent.input(screen.getByPlaceholderText(/Email/i), { target: { value: "fail@correo.com" } });
    fireEvent.input(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() =>
      expect(screen.getByText(/Correo o contraseña incorrectos/i)).toBeInTheDocument()
    );
  });

  test("llama a login y recarga la página si es exitoso", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    const originalReload = window.location.reload;
    window.location.reload = jest.fn();

    render(<Login />);
    fireEvent.input(screen.getByPlaceholderText(/Email/i), { target: { value: "ok@correo.com" } });
    fireEvent.input(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("ok@correo.com", "123456");
      expect(window.location.reload).toHaveBeenCalled();
    });

    window.location.reload = originalReload;
  });
});