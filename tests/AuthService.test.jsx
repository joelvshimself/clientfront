import { login, register, logout, isAuthenticated, getUserInfo } from "../src/services/authService";

describe("authService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("login retorna success true si response.ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { email: "a@b.com" } }),
    });
    const res = await login("a@b.com", "123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "123" }),
      })
    );
    expect(res.success).toBe(true);
    expect(res.data.user.email).toBe("a@b.com");
  });

  test("login retorna success false si response.ok es false", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Credenciales inválidas" }),
    });
    const res = await login("bad@b.com", "wrong");
    expect(res.success).toBe(false);
    expect(res.message).toBe("Credenciales inválidas");
  });

  test("register retorna success true si response.ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    const res = await register("Juan", "juan@correo.com", "abc123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Juan", email: "juan@correo.com", password: "abc123" }),
      })
    );
    expect(res.success).toBe(true);
  });

  test("register retorna success false si response.ok es false", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Ya existe" }),
    });
    const res = await register("Juan", "juan@correo.com", "abc123");
    expect(res.success).toBe(false);
    expect(res.message).toBe("Ya existe");
  });

  test("isAuthenticated retorna true si response.ok", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    const res = await isAuthenticated();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/check-auth"), expect.any(Object));
    expect(res).toBe(true);
  });

  test("isAuthenticated retorna false si fetch falla", async () => {
    fetch.mockRejectedValueOnce(new Error("fail"));
    const res = await isAuthenticated();
    expect(res).toBe(false);
  });

  test("logout llama a /logout", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    await logout();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/logout"), expect.any(Object));
  });

  test("getUserInfo retorna ok true y data si response.ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ nombre: "Pepe" }),
    });
    const res = await getUserInfo();
    expect(res.ok).toBe(true);
    expect(res.data.nombre).toBe("Pepe");
  });

  test("getUserInfo retorna ok false si response.ok es false", async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    const res = await getUserInfo();
    expect(res.ok).toBe(false);
    expect(res.data).toBeNull();
  });
});