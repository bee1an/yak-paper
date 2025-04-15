import { describe, expect, it } from 'vitest'
import { camelcase, kebabcase } from '../src/name-case'

describe('name-case.ts', () => {
	it('camelcase', () => {
		expect(camelcase('hello-world')).toBe('helloWorld')
	})

	it('kebabcase', () => {
		expect(kebabcase('helloWorld')).toBe('hello-world')
		expect(kebabcase('bBc')).toBe('b-bc')
	})
})
