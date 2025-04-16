import { getPulsePackages, mergeOutput, paperEntry, paperOutputDir, pkgDir } from '../utils'
import type { ModuleFormat } from 'rollup'
import fs from 'fs-extra'
import path from 'path'
import picocolors from 'picocolors'

/**
 * @description 打包格式
 */
export const formats = ['cjs', 'es'] as ModuleFormat[]

/**
 * @description 获取入口和输出(不包含主包)
 */
const getEntryAndOutput = () => {
	return getPulsePackages()
		.map(({ name }) => {
			const pkgJson = JSON.parse(
				fs.readFileSync(path.join(pkgDir, name, 'package.json')).toString()
			)

			if (!pkgJson.buildOptions?.entryPath) {
				console.log(picocolors.yellow(`No entry path for ${name}`))
				return null
			}

			return {
				name,
				input: path.join(pkgDir, name, pkgJson.buildOptions.entryPath),
				output: mergeOutput(
					path.join(pkgDir, name, 'dist'),
					pkgJson.buildOptions.formats || formats
				)
			}
		})
		.filter((item) => item !== null)
}

/**
 * @description 打包的入口和出口配置
 */
export const entrysAndOutput = getEntryAndOutput().concat([
	{ name: 'yak-paper', input: paperEntry, output: mergeOutput(paperOutputDir, formats) }
])
