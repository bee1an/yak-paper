import type { RollupOptions } from 'rollup'
import remove from './plugins/rollup-plugin-remove'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-esbuild'
import vue from 'unplugin-vue/rollup'
import VueJsx from 'unplugin-vue-jsx/rollup'

export default (arg: RollupOptions): RollupOptions => ({
	plugins: [
		remove(),
		resolve({ extensions: ['.ts'] }), // 居然不包含ts
		typescript(),
		vue(),
		VueJsx()
	],
	external: ['vue'],
	...arg
})
