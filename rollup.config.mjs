import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-esbuild'
import vue from 'unplugin-vue/rollup'
import VueJsx from 'unplugin-vue-jsx/rollup'

export default defineConfig({
	input: 'packages/yak-paper/index.ts',
	output: {
		dir: 'dist',
		format: 'es'
	},
	plugins: [
		resolve({ extensions: ['.ts'] }), // 居然不包含ts
		typescript(),
		vue(),
		VueJsx()
	],
	external: ['vue']
})
