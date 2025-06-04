/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Layout from "../src/components/Layout";
import { getCookie } from "../src/utils/getCookie";
import { getNavigationItemsForRole } from "../src/utils/navigationItems";
import { logout } from "../src/services/authService";
import { limpiarNotificaciones } from "../src/utils/notificacionesStorage";

// Mock NotificacionesPanel as a simple placeholder
jest.mock(
  "../src/components/NotificacionesPanel",
  () => () => <div data-testid="notificaciones-panel" />
);

// Mock utility functions and services
jest.mock("../src/utils/getCookie");
jest.mock("../src/utils/navigationItems");
jest.mock("../src/services/authService");
jest.mock("../src/utils/notificacionesStorage");

// Create a jest.fn() to capture navigate() calls
const mockNavigate = jest.fn();

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/current-path" }),
}));

jest.mock("@ui5/webcomponents-react", () => {
  const React = require("react");
  return {
    ShellBar: (props) => <div data-testid="mock-ShellBar" {...props}>{props.children}</div>,
    ShellBarItem: (props) => <button {...props}>{props.text}</button>,
    SideNavigation: (props) => <nav data-testid="mock-SideNavigation" {...props}>{props.children}</nav>,
    SideNavigationItem: (props) => <div data-route={props["data-route"]} onClick={props.onClick}>{props.text}</div>,
    FlexBox: (props) => <div data-testid="mock-FlexBox" {...props}>{props.children}</div>,
    Avatar: (props) => <ui5-avatar {...props} />,
  };
});

describe("Layout component", () => {
  let originalReload;

  beforeAll(() => {
    // Guarda el original y redefine reload como mock
    originalReload = window.location.reload;
    Object.defineProperty(window.location, "reload", {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
  });

  afterAll(() => {
    // Restaura el original
    Object.defineProperty(window.location, "reload", {
      configurable: true,
      writable: true,
      value: originalReload,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // getCookie() will return a JSON string: { nombre: "TestUser", role: "Admin" }
    getCookie.mockReturnValue(JSON.stringify({ nombre: "TestUser", role: "Admin" }));

    // getNavigationItemsForRole("Admin") → two sample nav items
    getNavigationItemsForRole.mockReturnValue([
      { route: "/dashboard", icon: "home", label: "Dashboard" },
      { route: "/settings", icon: "settings", label: "Settings" },
    ]);

    // logout() resolves immediately
    logout.mockResolvedValue();

    // limpiarNotificaciones() is a no-op
    limpiarNotificaciones.mockImplementation(() => {});
  });

  it("should render its children", () => {
    render(
      <Layout>
        <div data-testid="child-element">Hello Child</div>
      </Layout>
    );
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Hello Child")).toBeVisible();
  });

  it("should display the user's name and role in the ShellBar", () => {
    render(<Layout />);
    // The secondaryTitle is "TestUser - Admin"
    expect(screen.getByText("TestUser - Admin")).toBeInTheDocument();
  });

  it("should render navigation items based on the user's role", () => {
    render(<Layout />);
    // Expect both "Dashboard" and "Settings" to appear
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("should call navigate() with the correct route when a navigation item is clicked", () => {
    const { container } = render(<Layout />);
    // SideNavigationItem renders as a custom element with attribute data-route="/dashboard"
    const dashboardItem = container.querySelector('[data-route="/dashboard"]');
    expect(dashboardItem).toBeInTheDocument();
    fireEvent.click(dashboardItem);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle logout: call logout(), limpiarNotificaciones(), reload window, and navigate to /login", async () => {
    const { getByText } = render(<Layout />);
    // The "Salir" button is a ShellBarItem with text="Salir"
    const logoutButton = getByText("Salir");
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    // Wait for the logout() promise to resolve
    await Promise.resolve();

    expect(logout).toHaveBeenCalled();
    expect(limpiarNotificaciones).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should navigate to /profile when the Avatar (profile) is clicked", () => {
    const { container } = render(<Layout />);
    // Avatar renders as a <ui5-avatar> custom element
    const avatarElement = container.querySelector("ui5-avatar");
    expect(avatarElement).toBeInTheDocument();

    fireEvent.click(avatarElement);
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("should render the NotificacionesPanel", () => {
    render(<Layout />);
    expect(screen.getByTestId("notificaciones-panel")).toBeInTheDocument();
  });
});
