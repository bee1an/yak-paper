import { describe, expect, it } from 'vitest'
import { Formater } from '../src/formater/formater'

describe('formater', () => {
	it('show 2 format', () => {
		const mock1 = {
				type: 'text',
				content: '1'
			} as const,
			mock2 = {
				type: ['bold'],
				content: '2'
			} as any,
			mock3 = {
				type: ['bold', 'italic', 'underline'],
				content: '3'
			} as any

		expect(Formater.raw2Format(mock1)).toMatchInlineSnapshot(`"1"`)
		expect(Formater.raw2Format(mock2)).toMatchInlineSnapshot(`
			{
			  "children": "2",
			  "props": {
			    "data-format-bold": true,
			    "style": {
			      "fontWeight": "bold",
			    },
			  },
			  "tagName": "span",
			}
		`)
		expect(Formater.raw2Format(mock3)).toMatchInlineSnapshot(`
			{
			  "children": "3",
			  "props": {
			    "data-format-bold": true,
			    "data-format-italic": true,
			    "data-format-underline": true,
			    "style": {
			      "fontStyle": "italic",
			      "fontWeight": "bold",
			      "textDecoration": "underline",
			    },
			  },
			  "tagName": "span",
			}
		`)
	})

	it('should 2 raw', () => {
		const dom = document.createElement('div')
		const span = document.createElement('span')
		span.dataset.formatBold = 'true'
		span.dataset.formatUnderline = 'true'
		span.textContent = '123'
		span.style = 'font-weight: bold;'
		dom.appendChild(span)

		expect(span).toMatchInlineSnapshot(`
			<span
			  data-format-bold="true"
			  data-format-underline="true"
			  style="font-weight: bold;"
			>
			  123
			</span>
		`)

		expect(Formater.html2Raw(dom)).toMatchInlineSnapshot(`
			{
			  "format": [
			    {
			      "content": "123",
			      "type": [
			        "bold",
			        "underline",
			      ],
			    },
			  ],
			}
		`)
	})
})
