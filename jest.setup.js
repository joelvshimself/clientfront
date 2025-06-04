import fs from 'fs';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

const envFile = fs.existsSync('.env.test') ? '.env.test' : '.env';
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=([\s\S]*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000',
    },
  },
});

// ✅ Mock de reload sin beforeAll
try {
  if (typeof window !== 'undefined') {
    if (typeof window.location.reload === 'function') {
      window.location.reload = jest.fn();
    } else {
      Object.defineProperty(window.location, 'reload', {
        configurable: true,
        value: jest.fn(),
      });
    }
  }
} catch (e) {
  console.warn("No se pudo mockear window.location.reload:", e.message);
}
