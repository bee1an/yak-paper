import { camelcase, createBuilder, writeBuilder } from '../utils'
import getConfig from '../rollup.config'

import picocolors from 'picocolors'
import { entrysAndOutput } from './build-config'
import { getCmdOpts } from './build-cmd-opts'

const cmdOpts = getCmdOpts()

const buildAll = Object.keys(cmdOpts).length === 0

const resolvedEntrysAndOutput: (typeof entrysAndOutput)[number][] = []

if (buildAll) {
	resolvedEntrysAndOutput.push(...entrysAndOutput)
} else {
	for (const key in cmdOpts) {
		const entry = entrysAndOutput.find((item) => key && camelcase(item.name) === key)

		entry && resolvedEntrysAndOutput.push(entry)
	}
}

const { builders } = await createBuilder(
	resolvedEntrysAndOutput.map((option) => getConfig({ input: option.input }))
)

await Promise.all(
	builders.map(async (builder, index) => {
		const output = resolvedEntrysAndOutput[index].output

		await writeBuilder(builder, output)
	})
)

console.log(picocolors.green('-> Build complete'))
