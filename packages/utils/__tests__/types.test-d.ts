import { assertType, describe, expectTypeOf, it } from 'vitest'
import type { IncludeString, KeyIncludeString } from '../src/types'

describe('types.ts', () => {
	it('IncludeString', () => {
		let includeString: IncludeString<'a' | 'b'> = 'c'

		includeString = 'd'

		expectTypeOf(includeString).toEqualTypeOf<string>()
	})

	it('KeyIncludeString', () => {
		const keyIncludeString: KeyIncludeString<'a' | 'b'> = { a: '', b: '', c: '' }
		keyIncludeString.c = 1

		assertType<Record<string, any>>(keyIncludeString)
	})
})
