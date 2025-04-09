import type { ModuleFormat } from 'rollup'
import path from 'path'

interface MergeOutputReturn {
	dir: string
	format?: ModuleFormat
}

/**
 * @description 合并输出目录
 * @param outputDir 输出目录
 * @param formats 输出格式
 */
export const mergeOutput = (
	outputDir: string,
	formats: ModuleFormat | ModuleFormat[]
): MergeOutputReturn | MergeOutputReturn[] => {
	formats = Array.isArray(formats) ? formats : [formats]

	if (formats.length === 0) {
		return { dir: outputDir }
	}

	if (formats.length === 1) {
		return { dir: path.join(outputDir, formats[0]), format: formats[0] }
	}

	return formats.map((format) => {
		return { dir: path.join(outputDir, format), format }
	})
}
