import { getAllPackages } from '@yak-paper/build/utils'
import shell from 'shelljs'

getAllPackages().forEach(({ path }) => {
	shell.rm('-rf', `${path}/dist`)
	shell.rm('-rf', `${path}/node_modules`)
})
shell.rm('-rf', 'dist')
