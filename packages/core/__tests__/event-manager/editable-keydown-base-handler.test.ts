import { describe, expect, it } from 'vitest'
import { isOnlyModifierKeyPressed } from '../../src'
describe('editable-keydown-base-handler.ts', () => {
	it('isOnlyModifierKeyPressed', () => {
		const keyboardEvent = new KeyboardEvent('keydown', {
			ctrlKey: true
		})

		expect(isOnlyModifierKeyPressed(keyboardEvent, 'ctrlKey')).toBe(true)
		expect(isOnlyModifierKeyPressed(keyboardEvent, 'shiftKey')).toBe(false)
		expect(isOnlyModifierKeyPressed(keyboardEvent, 'altKey')).toBe(false)
		expect(isOnlyModifierKeyPressed(keyboardEvent, 'metaKey')).toBe(false)
	})
})
