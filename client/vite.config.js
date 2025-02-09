import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/server':{
        target:"https://prime-estates-backend.onrender.com",
        secure:false
      }
    }
  }
})
