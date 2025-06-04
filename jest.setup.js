import { TextEncoder, TextDecoder } from 'util'
import fs from 'fs'
import '@testing-library/jest-dom'

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}

// Carga variables desde .env o .env.test si existen
const envFile = fs.existsSync('.env.test') ? '.env.test' : '.env'
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=([\s\S]*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim()
    }
  }
}

// jest.setup.js
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000'
    }
  }
})

