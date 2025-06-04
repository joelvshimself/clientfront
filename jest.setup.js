import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// jest.setup.js
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: "http://localhost:3000", // Usa la URL de tu API aquí
    },
  },
});

