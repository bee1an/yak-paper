import type { RollupOptions } from 'rollup'
import remove from './plugins/remove'
import autoUseScss from './plugins/auto-use-scss'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-esbuild'
import vue from 'unplugin-vue/rollup'
import VueJsx from 'unplugin-vue-jsx/rollup'

export default (arg: RollupOptions): RollupOptions => ({
	plugins: [
		autoUseScss(),
		postcss({
			modules: true,
			use: {
				sass: {
					silenceDeprecations: ['legacy-js-api'] // 忽略这个警告, rollup没有找到合适的方案
				}
			} as any
		}),
		remove(),
		resolve({ extensions: ['.ts'] }), // 居然不包含ts
		typescript(),
		vue(),
		VueJsx()
	],
	external: ['vue'],
	...arg
})
