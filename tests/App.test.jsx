import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('renders the logo', () => {
  render(<App />)
  const logo = screen.getByAltText(/carnes viba/i)
  expect(logo).toBeInTheDocument()
})
