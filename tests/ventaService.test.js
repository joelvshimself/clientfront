import axios from "axios";
import { venderProductos, getVentas, eliminarVenta, editarVenta } from "../src/services/ventaService";

jest.mock("axios");

describe("ventaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VITE_API_URL = "http://localhost/api";
  });

  test("venderProductos llama a axios.post con la URL y payload correctos y retorna data", async () => {
    const payload = { productos: [{ producto: "Arrachera", cantidad: 2 }], fecha_emision: "2024-06-06" };
    axios.post.mockResolvedValueOnce({ data: { id_venta: 1 } });
    const data = await venderProductos(payload);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/vender",
      payload,
      expect.objectContaining({ withCredentials: true })
    );
    expect(data).toEqual({ id_venta: 1 });
  });

  test("getVentas llama a axios.get con la URL correcta y retorna data", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const data = await getVentas();
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost/api/ventas",
      expect.objectContaining({ withCredentials: true })
    );
    expect(data).toEqual([{ id: 1 }]);
  });

  test("eliminarVenta llama a axios.delete con la URL correcta y retorna data", async () => {
    axios.delete.mockResolvedValueOnce({ data: { ok: true } });
    const data = await eliminarVenta(5);
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost/api/ventas/5",
      expect.objectContaining({ withCredentials: true })
    );
    expect(data).toEqual({ ok: true });
  });

  test("editarVenta llama a axios.put con la URL y payload correctos y retorna data", async () => {
    const productos = [{ nombre: "Arrachera", cantidad: 2, costo_unitario: 100 }];
    axios.put.mockResolvedValueOnce({ data: { ok: true } });
    const data = await editarVenta(7, productos);
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost/api/ventas/7",
      { productos },
      expect.objectContaining({ withCredentials: true })
    );
    expect(data).toEqual({ ok: true });
  });

  test("venderProductos lanza error si axios.post falla", async () => {
    axios.post.mockRejectedValueOnce(new Error("fail"));
    await expect(venderProductos({})).rejects.toThrow("fail");
  });

  test("getVentas lanza error si axios.get falla", async () => {
    axios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(getVentas()).rejects.toThrow("fail");
  });

  test("eliminarVenta lanza error si axios.delete falla", async () => {
    axios.delete.mockRejectedValueOnce(new Error("fail"));
    await expect(eliminarVenta(1)).rejects.toThrow("fail");
  });

  test("editarVenta lanza error si axios.put falla", async () => {
    axios.put.mockRejectedValueOnce(new Error("fail"));
    await expect(editarVenta(1, [])).rejects.toThrow("fail");
  });
});