import { describe, expect, it } from 'vitest'
import { DocumentKeydownManager } from '../src/document-keydown-manager'

describe('document-keydown-manager.ts', () => {
	it('Singleton', () => {
		expect(DocumentKeydownManager.getInstance()).toBe(DocumentKeydownManager.getInstance())
	})
})
