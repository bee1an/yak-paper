import { describe, expect, it } from 'vitest'
import { DocumentKeydownManager } from '../src/keydown'

describe('document-keydown-manager.ts', () => {
	it('Singleton', () => {
		expect(DocumentKeydownManager.getInstance()).toBe(DocumentKeydownManager.getInstance())
	})
})
