// tests/compareByField.test.js

// ─── Implementación de compareByFiel
function compareByField(a, b, field, type = "string", order = "asc") {
  let valA = a?.[field];
  let valB = b?.[field];

  if (type === "date") {
    valA = new Date(valA);
    valB = new Date(valB);
    return order === "asc" ? valA - valB : valB - valA;
  }

  if (type === "number") {
    valA = Number(valA) || 0;
    valB = Number(valB) || 0;
    return order === "asc" ? valA - valB : valB - valA;
  }

  // string por defecto
  valA = valA?.toString() ?? "";
  valB = valB?.toString() ?? "";
  return order === "asc"
    ? valA.localeCompare(valB)
    : valB.localeCompare(valA);
}
// ────────────────────────────────────────────────────────────────────────────

describe("compareByField", () => {
  test("compara strings ascendente y descendente", () => {
    const obj1 = { name: "Ana" };
    const obj2 = { name: "Bea" };

    // ASC: "Ana" < "Bea" => devuelve < 0
    expect(compareByField(obj1, obj2, "name", "string", "asc")).toBeLessThan(0);
    // DESC: invierte => devuelve > 0
    expect(compareByField(obj1, obj2, "name", "string", "desc")).toBeGreaterThan(0);

    // Igualdad => devuelve 0
    const obj3 = { name: "Carlos" };
    const obj4 = { name: "Carlos" };
    expect(compareByField(obj3, obj4, "name", "string", "asc")).toBe(0);
    expect(compareByField(obj3, obj4, "name", "string", "desc")).toBe(0);
  });

  test("compara números ascendente y descendente", () => {
    const obj1 = { age: 10 };
    const obj2 = { age: 5 };

    // ASC: 10 - 5 = 5 (> 0)
    expect(compareByField(obj1, obj2, "age", "number", "asc")).toBeGreaterThan(0);
    // DESC: invierte => 5 - 10 = -5 (< 0)
    expect(compareByField(obj1, obj2, "age", "number", "desc")).toBeLessThan(0);

    // Si alguno no es numérico (null/undefined), se trata como 0
    const obj3 = { age: null };
    const obj4 = {}; // age = undefined
    expect(compareByField(obj3, obj4, "age", "number", "asc")).toBe(0);
  });

  test("compara fechas ascendente y descendente", () => {
    const obj1 = { fecha: "2025-06-05" };
    const obj2 = { fecha: "2025-06-01" };

    // ASC: new Date("05") - new Date("01") > 0
    expect(compareByField(obj1, obj2, "fecha", "date", "asc")).toBeGreaterThan(0);
    // DESC: invierte => new Date("01") - new Date("05") < 0
    expect(compareByField(obj1, obj2, "fecha", "date", "desc")).toBeLessThan(0);

    // Si ambas fechas son iguales => 0
    const obj3 = { fecha: "2025-01-01" };
    const obj4 = { fecha: "2025-01-01" };
    expect(compareByField(obj3, obj4, "fecha", "date", "asc")).toBe(0);
    expect(compareByField(obj3, obj4, "fecha", "date", "desc")).toBe(0);
  });

  test("cubre caso por defecto (string) cuando el campo no existe", () => {
    const obj1 = {};
    const obj2 = { cualquier: 123 };
    // Ambos se transforman a "" y "" => igualdad
    expect(compareByField(obj1, obj2, "noExiste", "string", "asc")).toBe(0);
  });
});
