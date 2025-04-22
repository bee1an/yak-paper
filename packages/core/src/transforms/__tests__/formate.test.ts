import { describe, expect, it } from 'vitest'
import { jsonDeserializer } from '../src/json-deserializer'

describe('jsonDeserializer', () => {
	it('text', () => {
		const input = { type: 'text', content: 'Hello, World!' } as const
		expect(jsonDeserializer(input)).toBe('Hello, World!')
	})

	it('blob', () => {
		const input = { type: 'blob', content: 'Blob Content' } as const
		expect(jsonDeserializer(input)).toEqual({
			tagName: 'span',
			props: {
				'data-formate': 'blob',
				style: {
					fontWeight: 'bold'
				}
			},
			children: 'Blob Content'
		})
	})

	it('underline', () => {
		const input = { type: 'underline', content: 'Underlined Text' } as const
		expect(jsonDeserializer(input)).toEqual({
			tagName: 'span',
			props: {
				'data-formate': 'underline',
				style: {
					textDecoration: 'underline'
				}
			},
			children: 'Underlined Text'
		})
	})

	it('italic', () => {
		const input = { type: 'italic', content: 'Italic Text' } as const
		expect(jsonDeserializer(input)).toEqual({
			tagName: 'span',
			props: {
				'data-formate': 'italic',
				style: {
					fontStyle: 'italic'
				}
			},
			children: 'Italic Text'
		})
	})
})
