import { defineConfig, ENV } from './define'

export default defineConfig({
  ENV: ENV.local,
  BASE_API: 'http://localhost:4099',
})
