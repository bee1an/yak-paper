import fs from 'fs-extra'
import path from 'path'
import { pkgDir, rootDir } from './paths'

interface PackagesCfg {
	name: string
	description: string
}

interface GetPulsePackagesOpts {
	useCache?: boolean
}

const pulsePkgCache: PackagesCfg[] = []

/**
 * @description 获取除主包外的其他核心包
 */
export const getPulsePackages = ({ useCache = true }: GetPulsePackagesOpts = {}) => {
	if (useCache && pulsePkgCache.length) return pulsePkgCache

	const paksCfg = fs
		.readdirSync(pkgDir)
		.filter((name) => name !== 'yak-paper')
		.map((name) => {
			const pkgJson = JSON.parse(
				fs.readFileSync(path.join(pkgDir, name, 'package.json')).toString()
			)

			return { name, description: pkgJson.description }
		})

	pulsePkgCache.length = 0
	pulsePkgCache.push(...paksCfg)

	return pulsePkgCache
}

interface GetAllPackagesOpts {
	useCache?: boolean
}

const pkgCache: PackagesCfg[] = []

/**
 * @description 获取所有包
 */
export const getAllPackages = ({ useCache = true }: GetAllPackagesOpts = {}) => {
	if (useCache && pkgCache.length) return pkgCache

	const pulsePkgs = getPulsePackages({ useCache })

	const workspaceYaml = fs.readFileSync(path.join(rootDir, 'pnpm-workspace.yaml')).toString()

	const otherPkgs =
		workspaceYaml
			.match(/(- '\w*)/g)
			?.filter((item) => !item.includes('packages'))
			.map((item) => {
				const name = item.replace(/(- ')/g, '')
				const pkgJson = JSON.parse(
					fs.readFileSync(path.join(rootDir, name, 'package.json')).toString()
				)
				return { name, description: pkgJson.description }
			}) ?? []

	return pulsePkgs.push(...otherPkgs)
}
getAllPackages()
