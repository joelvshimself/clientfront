import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  venderProductos,
  getVentas,
  eliminarVenta,
  editarVenta,
} from '../src/services/ventaService'; // 👈 ajusta según la ubicación real

const mock = new MockAdapter(axios);
const BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

describe('ventaService', () => {
  afterEach(() => {
    mock.reset();
  });

  it('debe vender productos correctamente', async () => {
    const payload = { productos: [{ nombre: 'res', cantidad: 2 }] };
    const mockResponse = { success: true, mensaje: 'Venta registrada' };

    mock.onPost(`${BASE_URL}/vender`).reply(200, mockResponse);

    const data = await venderProductos(payload);
    expect(data).toEqual(mockResponse);
  });

  it('debe obtener ventas correctamente', async () => {
    const mockVentas = [
      { id: 1, productos: [{ nombre: 'pollo', cantidad: 1 }] },
    ];

    mock.onGet(`${BASE_URL}/ventas`).reply(200, mockVentas);

    const data = await getVentas();
    expect(data).toEqual(mockVentas);
  });

  it('debe eliminar una venta correctamente', async () => {
    const ventaId = 1;
    const mockResponse = { success: true };

    mock.onDelete(`${BASE_URL}/ventas/${ventaId}`).reply(200, mockResponse);

    const data = await eliminarVenta(ventaId);
    expect(data).toEqual(mockResponse);
  });

  it('debe editar una venta correctamente', async () => {
    const ventaId = 1;
    const productosEditados = [{ nombre: 'tomahawk', cantidad: 3 }];
    const mockResponse = { success: true };

    mock.onPut(`${BASE_URL}/ventas/${ventaId}`).reply(200, mockResponse);

    const data = await editarVenta(ventaId, productosEditados);
    expect(data).toEqual(mockResponse);
  });

  it('debe lanzar error al fallar la venta', async () => {
    const payload = { productos: [] };
    mock.onPost(`${BASE_URL}/vender`).reply(500, { error: 'Error interno' });

    await expect(venderProductos(payload)).rejects.toThrow('Request failed with status code 500');
  });
});
