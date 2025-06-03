// tests/NotFound.test.jsx
import '@testing-library/jest-dom'; // matcher para .toBeInTheDocument()
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../src/pages/NotFound";

describe("NotFound page", () => {
  test("renders 404 title, message and link with correct href and navigation", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    // Verifica el título 404
    expect(screen.getByText("404")).toBeInTheDocument();

    // Verifica el mensaje de error
    expect(screen.getByText("Oops! The page you're looking for doesn't exist.")).toBeInTheDocument();

    // Verifica que exista el link y que tenga href="/"
    const link = screen.getByRole("link", { name: /go back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");

    // Simular click en el link
    fireEvent.click(link);

    // Como usamos MemoryRouter, no se navega realmente,
    // pero podemos verificar que el link sea interactuable sin errores.
  });
});
