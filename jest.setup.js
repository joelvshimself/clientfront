import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
// jest.setup.js
process.env.VITE_API_URL = "http://localhost:3000"; // o la URL/valor que necesites para los tests
