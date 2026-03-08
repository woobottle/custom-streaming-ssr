import { defineConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }: ConfigEnv) => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      port: 3000,
      ssr: isSsrBuild,
    },
    build: {
      outDir: isSsrBuild ? 'dist/server' : 'dist/client',
    }
  }
})
