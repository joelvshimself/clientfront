// tests/App.test.jsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";

test("renders the welcome heading", () => {
  render(<App />);
  // Busca exactamente el texto que tu App.jsx muestra. Ajusta la regex si tu texto es distinto.
  const heading = screen.getByText(/¡Bienvenido a Logiviba!/i);
  expect(heading).toBeInTheDocument();
});
