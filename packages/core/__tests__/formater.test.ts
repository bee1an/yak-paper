import { describe, expect, it } from 'vitest'
import { Formater } from '../src/formater/formater'

describe('formater', () => {
	it('shoud work', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.innerHTML =
			'她还只是个孩子，躲在教堂的地下室里，听着外面传来的<span data-format-bold="true" style="font-weight: bold;">脚步声</span>和低语。那些声音不属于这个世界，它们来自一个被遗忘的<span data-format-italic="true" style="font-style: italic;">维度</span>。'

		const range = document.createRange()

		range.setStart(editable.childNodes[0], 5)
		range.setEnd(editable.childNodes[1].childNodes[0], 1) // ! 这里要选文字 !

		window.getSelection()!.addRange(range)

		const instance = Formater.getInstance()
		// 模拟一个中介者
		instance.setMediator({
			notify() {
				return range
			}
		})

		instance.formatSelect('bold')
		expect(editable.innerHTML).toMatchInlineSnapshot(
			`"她还只是个<span data-format-bold="true" style="font-weight: bold;">孩子，躲在教堂的地下室里，听着外面传来的</span><span data-format-bold="true" style="font-weight: bold;">脚</span><span data-format-bold="true" style="font-weight: bold;">步声</span>和低语。那些声音不属于这个世界，它们来自一个被遗忘的<span data-format-italic="true" style="font-style: italic;">维度</span>。"`
		)

		range.setStart(editable.childNodes[0], 1)
		range.setEnd(editable.childNodes[0], 2)

		instance.formatSelect('italic')

		expect(editable.innerHTML).toMatchInlineSnapshot(
			`"她<span data-format-italic="true" style="font-style: italic;">还</span>只是个<span data-format-bold="true" style="font-weight: bold;">孩子，躲在教堂的地下室里，听着外面传来的</span><span data-format-bold="true" style="font-weight: bold;">脚</span><span data-format-bold="true" style="font-weight: bold;">步声</span>和低语。那些声音不属于这个世界，它们来自一个被遗忘的<span data-format-italic="true" style="font-style: italic;">维度</span>。"`
		)
	})

	it('shoud 2 format', () => {
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
