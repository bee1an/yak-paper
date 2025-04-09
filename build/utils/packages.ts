import fs from 'fs-extra'
import path from 'path'
import { pkgDir, rootDir } from './paths'

interface PackagesCfg {
	name: string
	description: string
	path: string
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
			const pakPath = path.join(pkgDir, name)
			const pkgJson = JSON.parse(fs.readFileSync(path.join(pakPath, 'package.json')).toString())

			return { name, description: pkgJson.description, path: pakPath }
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
				const pakPath = path.join(rootDir, name)
				const pkgJson = JSON.parse(fs.readFileSync(path.join(pakPath, 'package.json')).toString())
				return { name, description: pkgJson.description, path: pakPath }
			}) ?? []

	pkgCache.length = 0
	pkgCache.push(...pulsePkgs, ...otherPkgs)

	return pkgCache
}
getAllPackages()
