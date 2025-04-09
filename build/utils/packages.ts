import fs from 'fs-extra'
import path from 'path'
import { pkgDir } from '../utils/paths'

interface PulsePackagesCfg {
	name: string
	description: string
}

interface GetPulsePackagesOpts {
	useCache?: boolean
}

const pkgCache: PulsePackagesCfg[] = []

/**
 * @description 获取除主包外的其他核心包
 */
export const getPulsePackages = ({ useCache = true }: GetPulsePackagesOpts = {}) => {
	if (useCache && pkgCache.length) return pkgCache

	const paksCfg = fs
		.readdirSync(pkgDir)
		.filter((name) => name !== 'yak-paper')
		.map((name) => {
			const pkgJson = JSON.parse(
				fs.readFileSync(path.join(pkgDir, name, 'package.json')).toString()
			)

			return {
				name,
				description: pkgJson.description
			}
		})

	pkgCache.length = 0
	pkgCache.push(...paksCfg)

	return pkgCache
}
