import { describe, expect, it } from 'vitest'
import { getTextNode } from '../src/dom'

describe('dom', () => {
	it('shoud return text node', () => {
		const textNode = document.createTextNode('hello')

		expect(getTextNode(textNode)).toMatchInlineSnapshot(`
			[
			  hello,
			]
		`)

		const spanNode = document.createElement('span')
		spanNode.innerHTML = 'hello '
		const inSpanTextNode = document.createTextNode('world')
		spanNode.appendChild(inSpanTextNode)
		expect(getTextNode(spanNode)).toMatchInlineSnapshot(`
			[
			  hello ,
			  world,
			]
		`)
	})
})
