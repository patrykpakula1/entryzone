import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // @react-three/fiber potrafi wciągnąć własną kopię Reacta przez
  // pre-bundling — wtedy hooki w <Canvas> lecą "Invalid hook call".
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
})
