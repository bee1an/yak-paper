import { describe, expect, it } from 'vitest'
import {
	findChildElementIsEditable,
	getChildrenNode,
	getTextNodeBySite,
	isEditable
} from '../src/dom'

describe('dom', () => {
	it('shoud find child element is editable', () => {
		const container = document.createElement('div')

		const createEditable = () => {
			const el = document.createElement('div')
			el.contentEditable = 'true'
			return el
		}

		const createNonEditable = () => {
			const el = document.createElement('div')
			return el
		}

		const nonEditable = createNonEditable()
		nonEditable.append(createEditable())

		container.append(createEditable())
		container.append(nonEditable)
		container.append(createEditable())

		expect(findChildElementIsEditable(container)).toMatchInlineSnapshot(`
			[
			  <div />,
			  <div />,
			]
		`)

		expect(findChildElementIsEditable(container, { deep: true })).toMatchInlineSnapshot(`
			[
			  <div />,
			  <div />,
			  <div />,
			]
		`)
	})

	it('shoud return is editable', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		expect(isEditable(editable)).toMatchInlineSnapshot(`true`)

		const notEditable = document.createElement('div')
		expect(isEditable(notEditable)).toMatchInlineSnapshot(`false`)
	})

	const textNode = document.createTextNode('hello')

	const spanNode = document.createElement('span')
	spanNode.innerHTML = 'hello '
	spanNode.appendChild(document.createTextNode('world'))

	it('shoud return text node by site', () => {
		expect(getTextNodeBySite(textNode, 'first')).toMatchInlineSnapshot(`hello`)
		expect(getTextNodeBySite(textNode, 'last')).toMatchInlineSnapshot(`hello`)

		expect(getTextNodeBySite(spanNode, 'first')).toMatchInlineSnapshot(`hello`)
		expect(getTextNodeBySite(spanNode, 'last')).toMatchInlineSnapshot(`world`)

		const wrapper = document.createElement('div')
		wrapper.appendChild(spanNode)
		expect(getTextNodeBySite(wrapper, 'first')).toMatchInlineSnapshot(`hello`)
		expect(getTextNodeBySite(wrapper, 'last')).toMatchInlineSnapshot(`world`)
	})

	it('shoud return text node', () => {
		expect(getChildrenNode(textNode)).toMatchInlineSnapshot(`
			[
			  hello,
			]
		`)

		expect(getChildrenNode(spanNode)).toMatchInlineSnapshot(`
			[
			  hello ,
			  world,
			]
		`)
	})
})
