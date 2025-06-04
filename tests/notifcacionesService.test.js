import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  crearNotificacion,
  getNotificaciones
} from '../src/services/notificacionesService';

const mock = new MockAdapter(axios);
const BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

describe('notificacionesService', () => {
  afterEach(() => {
    mock.reset();
  });

  it('crearNotificacion debe retornar data si el POST es exitoso', async () => {
    const notificacionData = { mensaje: 'Nuevo evento', tipo: 'info' };
    const mockResponse = { id: 1, ...notificacionData };

    mock
      .onPost(${BASE_URL}/notificaciones, notificacionData)
      .reply(201, mockResponse);

    const result = await crearNotificacion(notificacionData);
    expect(result).toEqual(mockResponse);
  });

  it('crearNotificacion debe retornar null si hay error en POST', async () => {
    const notificacionData = { mensaje: 'Fallo', tipo: 'error' };

    mock
      .onPost(${BASE_URL}/notificaciones, notificacionData)
      .reply(500, { error: 'Error interno' });

    const result = await crearNotificacion(notificacionData);
    expect(result).toBeNull();
  });

  it('getNotificaciones debe retornar lista si GET es exitoso', async () => {
    const mockResponse = [
      { id: 1, mensaje: 'Evento A', tipo: 'info' },
      { id: 2, mensaje: 'Evento B', tipo: 'warning' },
    ];

    mock.onGet(${BASE_URL}/notificaciones).reply(200, mockResponse);

    const result = await getNotificaciones();
    expect(result).toEqual(mockResponse);
  });

  it('getNotificaciones debe retornar [] si falla el GET', async () => {
    mock.onGet(${BASE_URL}/notificaciones).reply(500);

    const result = await getNotificaciones();
    expect(result).toEqual([]);
  });
});