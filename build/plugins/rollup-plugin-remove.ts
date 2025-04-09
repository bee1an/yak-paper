import type { Plugin } from 'rollup'
import fs from 'fs'
import { pkgDir, rootDir } from '../utils/paths'
import path from 'path'
import shelljs from 'shelljs'

function removePlugin(): Plugin {
	return {
		name: 'remove',
		buildStart(options) {
			const inputs = Array.isArray(options.input) ? options.input : Object.values(options.input)

			const pkgs = fs.readdirSync(pkgDir)

			pkgs.forEach((pkg) => {
				const pkgPath = path.join(pkgDir, pkg)

				if (inputs.find((input) => input.includes(pkgPath))) {
					if (pkg === 'yak-paper') {
						shelljs.rm('-rf', path.join(rootDir, 'dist'))
					} else {
						shelljs.rm('-rf', path.join(pkgPath, 'dist'))
					}
				}
			})
		}
	}
}

export default removePlugin
