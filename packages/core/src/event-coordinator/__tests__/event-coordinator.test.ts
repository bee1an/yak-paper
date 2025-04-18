import { describe, expect, it } from 'vitest'
import { KeyBinding } from '../src/event-coordinator'

describe('key-binding.text.ts', () => {
	it('Singleton', () => {
		expect(KeyBinding.getInstance()).toBe(KeyBinding.getInstance())
	})
})
