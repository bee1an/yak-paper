import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const isDev = mode === 'development'

	return {
		plugins: [Vue(), VueJsx(), UnoCSS(), Components({ dts: true })],
		server: { port: 8888 },
		build: { minify: !isDev },
		resolve: {
			alias: {
				'yak-paper': path.resolve(__dirname, '../packages/yak-paper'),
				'@': path.resolve(__dirname, 'src')
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: "@use '@yak-paper/theme-utils/style' as *;"
				}
			}
		}
	}
})
