jest.mock("../src/pages/home.css", () => ({}));
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../src/pages/home";
import { getOrdenes } from "../src/services/ordenesService";
import { agregarNotificacion } from "../src/components/Notificaciones";

// ── Mocks de @ui5/webcomponents-react y @ui5/webcomponents-react-charts ─────────────────────────────
jest.mock("@ui5/webcomponents-react", () => ({
  Title: () => <div data-testid="mock-title">Title</div>,
}));

jest.mock("@ui5/webcomponents-react-charts", () => ({
  LineChart: (props) => <div data-testid={props["data-testid"]}>LineChart</div>,
  PieChart: (props) => <div data-testid={props["data-testid"]}>PieChart</div>,
}));

// ── Mock de getOrdenes para éxito y para error ─────────────────────────────────────────────────────
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
}));

jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

describe("Home component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza los títulos y los tres gráficos cuando getOrdenes resuelve correctamente", async () => {
    // 1) Hacemos que getOrdenes resuelva con un arreglo de órdenes ficticias
    getOrdenes.mockResolvedValueOnce([
      { fecha: "2023-01-01", costo: 100 },
      { fecha: "2023-02-01", costo: 120 },
    ]);

    render(<Home />);

    // 2) Comprobamos que, inicialmente, aparezcan los tres títulos (con el mock de Title)
    //    Dado que Title está mockeado como un <div data-testid="mock-title">Title</div>,
    //    habrá 3 apariciones de ese mismo testid.
    const allTitles = await screen.findAllByTestId("mock-title");
    expect(allTitles).toHaveLength(3);

    // 3) Comprobamos que los charts aparecen (con sus respectivos data-testid)
    //    Como el componente usa dos <LineChart data-testid="line-chart" /> y
    //    un <PieChart data-testid="pie-chart" />:
    await waitFor(() => {
      expect(screen.getAllByTestId("line-chart")).toHaveLength(2);
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });

    // 4) Nos cercioramos de que getOrdenes se haya llamado exactamente 1 vez
    expect(getOrdenes).toHaveBeenCalledTimes(1);
  });

  test("si getOrdenes falla, llama a agregarNotificacion con tipo 'error'", async () => {
    // Hacemos que getOrdenes rechace para simular error
    getOrdenes.mockRejectedValueOnce(new Error("fallo al obtener"));
    
    render(<Home />);

    // Esperamos que, al rechazar, se dispare agregarNotificacion("Error al cargar órdenes", "error")
    await waitFor(() => {
      expect(agregarNotificacion).toHaveBeenCalledWith(
        "Error al cargar órdenes",
        "error"
      );
    });

    // También podemos asegurarnos de que, incluso con el error, intente renderizar los títulos
    const allTitlesOnError = await screen.findAllByTestId("mock-title");
    expect(allTitlesOnError).toHaveLength(3);
  });
});
