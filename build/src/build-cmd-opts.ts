import { program } from 'commander'
import { getPulsePackages } from '../utils/packages'

/**
 * @description 获取命令行参数
 */
export const getCmdOpts = () => {
	getPulsePackages().forEach(({ name, description }) => {
		program.option(`--${name}`, description)
	})

	program.option('--yak-paper', 'yak-paper')

	program.parse()

	return program.opts()
}
