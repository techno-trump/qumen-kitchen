import { defineConfig } from 'astro/config';
import path from "path";
import mkcert from 'vite-plugin-mkcert'
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
	build: {
    format: 'file', // Генерация страниц как отдельных файлов
  },
	compressHTML: false,
	vite: {
    server: {
      proxy: {
        '/assets': 'http://localhost:5173', // Проксируем Webpack
      },
			watch: {
        paths: ['dist/assets/**/*.js'], // Следим за изменениями JS-файлов
      },
    },
		resolve: {
			alias: {
				'img': path.resolve(__dirname, 'public/img')
			}
		},
    build: {
      minify: false, // Отключает минимизацию всего (HTML, JS, CSS)
    },
		logging: {
			level: 'errors', // или 'debug'
		}
  },
});
