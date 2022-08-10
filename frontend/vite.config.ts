import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NODE_ENV: 'development',
      API_LOCAL_URL: 'http://dev.com:4000',
      API_URL: 'https://mhmdhidr-restaurant-app.herokuapp.com',
      EMAIL: 'mr.hamood277@gmail.com',
      PAYPAL_CLIENT_ID:
        'AQAEqrh-ix7nzI-Og_LXGU1Ut_O_c8ujL4K3wl6oOftDucuXMjcGEjcGFYlKQZAw1ZQts3L5KpJ0QCwd',
      GOOGLE_CLIENT_ID:
        '595715611121-eb93vvdlldfol8pk208qdv2kamlk7r2d.apps.googleusercontent.com'
    }
  }
})
