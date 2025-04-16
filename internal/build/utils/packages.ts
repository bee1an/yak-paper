import fs from 'fs-extra'
import path from 'path'
import { pkgDir, rootDir } from './paths'
import fg from 'fast-glob'

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
 * @description 获取核心包
 */
export const getPulsePackages = ({ useCache = true }: GetPulsePackagesOpts = {}) => {
	if (useCache && pulsePkgCache.length) return pulsePkgCache

	const paksCfg = fs
		.readdirSync(pkgDir)
		.map((name) => {
			const pakPath = path.join(pkgDir, name)
			const pkgJson = JSON.parse(fs.readFileSync(path.join(pakPath, 'package.json')).toString())

			if (!pkgJson.buildOptions) return null

			return { name, description: pkgJson.description, path: pakPath }
		})
		.filter((item) => item !== null)

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
			.match(/('([^']*)')/g)
			?.filter((item) => !item.includes('packages'))
			.reduce((pre, item) => {
				const pkgs = fg
					.globSync(item.slice(1, -1), { cwd: rootDir, onlyDirectories: true })
					.map((name) => {
						const pakPath = path.join(rootDir, name)
						console.log('pakPath', pakPath)
						const pkgJson = JSON.parse(
							fs.readFileSync(path.join(pakPath, 'package.json')).toString()
						)
						return { name, description: pkgJson.description, path: pakPath }
					})

				return pre.concat(pkgs)
			}, [] as PackagesCfg[]) ?? []

	pkgCache.length = 0
	pkgCache.push(...pulsePkgs, ...otherPkgs)

	return pkgCache
}
