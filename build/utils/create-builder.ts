import {
	rollup,
	type OutputOptions,
	type RollupBuild,
	type RollupOptions,
	type RollupOutput
} from 'rollup'

type AnyToArray<T> = T extends (args: infer P) => infer R
	? (args: P[]) => AnyToArray<R>
	: T extends Promise<any>
		? Promise<Awaited<T>[]>
		: T[]

type ToArrayValue<T> = T extends object ? { [K in keyof T]: AnyToArray<T[K]> } : AnyToArray<T>

interface CreateBuilderReturn {
	builders: RollupBuild
}

function createBuilder(options: RollupOptions): Promise<CreateBuilderReturn>
function createBuilder(options: RollupOptions[]): Promise<ToArrayValue<CreateBuilderReturn>>
async function createBuilder<T extends RollupOptions | RollupOptions[]>(options: T) {
	const isMultipleOptions = Array.isArray(options)

	const _options = isMultipleOptions ? options : [options]

	const builders = await Promise.all(
		_options.map(async (option) => {
			return await rollup(option)
		})
	)

	return {
		builders: isMultipleOptions ? builders : builders[0]
	}
}

async function writeBuilder<T extends OutputOptions | OutputOptions[]>(
	builder: RollupBuild,
	outputOptions: T
): Promise<T extends OutputOptions ? RollupOutput : RollupOutput[]> {
	const isMultipOutput = Array.isArray(outputOptions)

	const _outputOptions = (isMultipOutput ? outputOptions : [outputOptions]) as OutputOptions[]

	const result = await Promise.all(
		_outputOptions.map(async (option) => {
			return await builder.write(option)
		})
	)

	return (isMultipOutput ? result : result[0]) as T extends OutputOptions
		? RollupOutput
		: RollupOutput[]
}

export { createBuilder, writeBuilder }
