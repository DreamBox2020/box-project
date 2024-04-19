import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('command：', command)
  console.log('mode：', mode)

  return {
    base: './',
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [eslint(), react()],
    server: {
      host: '0.0.0.0',
      port: 4008,
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
    },
  }
})
