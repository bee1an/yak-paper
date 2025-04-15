import type { Plugin } from 'rollup'
import path from 'path'
import { pkgDir } from '../utils'

// 匹配的路径, 较真写法, 可以不用这个, 直接判断是否是 scss 文件
const autoUsePath = /\w*\\packages\\(core|material)\\.*\w*.module.scss/

function autoUseScss(): Plugin {
	return {
		name: 'auto-use-scss',
		transform: {
			handler(code, id) {
				if (autoUsePath.test(id)) {
					return {
						code:
							`@use '${path
								.relative(path.dirname(id), path.join(pkgDir, 'theme-utils/style'))
								.replaceAll('\\', '/')}' as *;` + code
					}
				}
			}
		}
	}
}

export default autoUseScss
