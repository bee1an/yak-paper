import { describe, expect, it } from 'vitest'
import { DocumentKeydownBinder } from '../src/document-keydown-binder'

describe('document-keydown-binder.ts', () => {
	it('Singleton', () => {
		expect(DocumentKeydownBinder.getInstance()).toBe(DocumentKeydownBinder.getInstance())
	})
})
