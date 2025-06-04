import { getOrdenes, createOrden, deleteOrden, updateOrden, completarOrden } from "../src/services/ordenesService";
import axios from "axios";

jest.mock("axios");

describe("🧪 ordenesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getOrdenes llama a axios.get con la URL correcta y retorna data", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ ID_ORDEN: 1 }] });
    const data = await getOrdenes();
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/ordenes"), expect.any(Object));
    expect(data).toEqual([{ ID_ORDEN: 1 }]);
  });

  test("createOrden llama a axios.post y retorna data", async () => {
    const payload = { correo_solicita: "a", correo_provee: "b" };
    axios.post.mockResolvedValueOnce({ data: { id_orden: 123 } });
    const res = await createOrden(payload);
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/nuevaorden"), payload, expect.any(Object));
    expect(res).toEqual({ id_orden: 123 });
  });

  test("deleteOrden llama a axios.delete y retorna true si status 200", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });
    const ok = await deleteOrden(2);
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining("/ordenes/2"), expect.any(Object));
    expect(ok).toBe(true);
  });

  test("updateOrden llama a axios.put y retorna true si status 200", async () => {
    axios.put.mockResolvedValueOnce({ status: 200 });
    const ok = await updateOrden(5, { estado: "completada" });
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining("/ordenes/5"), { estado: "completada" }, expect.any(Object));
    expect(ok).toBe(true);
  });

  test("completarOrden llama a axios.post y retorna data", async () => {
    axios.post.mockResolvedValueOnce({ data: { ok: true } });
    const res = await completarOrden(7, "2025-06-05");
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/completarorden/7"),
      { fecha_recepcion: "2025-06-05" },
      expect.any(Object)
    );
    expect(res).toEqual({ ok: true });
  });
});