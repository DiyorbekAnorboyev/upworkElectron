import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   main: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   preload: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   renderer: {
//     resolve: {
//       alias: {
//         '@renderer': resolve('src/renderer/src')
//       }
//     },
//     plugins: [react()]
//   }
// })


export default defineConfig({
  main: {
    // Ensure sequelize and sqlite3 are bundled
    build: {
      rollupOptions: {
        external: [
          // You can add other modules you want to externalize here, if any
        ],
      },
    },
    plugins: [
      externalizeDepsPlugin({
        include: ['sequelize', 'sqlite3'], // Include sequelize and sqlite3 for bundling
      }),
    ],
  },
  preload: {
    build: {
      rollupOptions: {
        external: [
          // You can add other modules you want to externalize here, if any
        ],
      },
    },
    plugins: [
      externalizeDepsPlugin({
        include: ['sequelize', 'sqlite3'], // Include sequelize and sqlite3 for bundling
      }), 
    ],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react()],
  },
});
