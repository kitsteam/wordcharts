/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],

      server: {
        port: 3000,
        host: '0.0.0.0',
        https: false,
        proxy: {
          "/api": {
            target: "http://localhost:4000",
            secure: false,
            ws: true,
          },
          "/socket": {
            target: "http://localhost:4000",
            secure: false,
            ws: true,
          },
        },
      },
      base: ""
    }
  } else {
    // command === 'build'
    return {
      plugins: [react()],

      server: {
        port: parseInt(process.env.URL_PORT, 10),
        host: process.env.URL_HOST,
        https: process.env.URL_SCHEME === 'https'
      },
      // webapp folder is for static assets that are served by phoenix
      // all internal routing is leveraging the app prefix that defaults to react via pheonix controller
      base: "/webapp/"
    }
  }
});