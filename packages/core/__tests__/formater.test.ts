import { describe, expect, it } from 'vitest'
import { Formater } from '../src/formater/formater'

describe('formater', () => {
	// it('shoud format cross block', () => {
	// 	const container = document.createElement('div')

	// 	const section = document.createElement('section')
	// 	section.dataset.blockType = 'text'
	// 	const editable = document.createElement('div')
	// 	editable.contentEditable = 'true'
	// 	editable.innerHTML =
	// 		'她还只是个孩子，躲在教堂的地下室里，听着外面传来的 <span data-format-bold="true" style="font-weight: bold;">脚步声</span>和低语。那些声音不属于这个世界，它们来自一个被遗忘的<span data-format-italic="true" style="font-style: italic;">维度</span>。'
	// 	section.appendChild(editable)

	// 	const section2 = document.createElement('section')
	// 	section2.dataset.blockType = 'text'
	// 	const editable2 = document.createElement('div')
	// 	editable2.contentEditable = 'true'
	// 	editable2.innerHTML =
	// 		'“你以为时间会抹去一切，但有些东西……它只是在等待。” 那熟悉的声音再次响起，带着一种令人心悸的平静。'
	// 	section2.appendChild(editable2)

	// 	const section3 = document.createElement('section')
	// 	section3.dataset.blockType = 'text'
	// 	const editable3 = document.createElement('div')
	// 	editable3.contentEditable = 'true'
	// 	editable3.innerHTML =
	// 		'她终于转过身来，看着那个站在阴影中的身影。他穿着一袭深色风衣，脸上布满岁月的痕迹，却依旧保持着当年那种令人敬畏的 <span data-format-italic="true" style="font-style: italic;">气场</span>。'
	// 	section3.appendChild(editable3)

	// 	container.append(section, section2, section3)

	// 	const range = document.createRange()

	// 	const blockSpan = container.querySelector('[data-format-bold="true"]')
	// 	range.setStart(blockSpan!.childNodes[0], 1)

	// 	expect(blockSpan!.childNodes[0]).toMatchInlineSnapshot(`脚步声`)

	// 	const italicSpan = container.querySelectorAll('[data-format-italic="true"]')[1]
	// 	range.setEnd(italicSpan!.childNodes[0], 1)

	// 	expect(italicSpan!.childNodes[0]).toMatchInlineSnapshot(`气场`)

	// 	const instance = Formater.getInstance()
	// 	// 模拟一个中介者
	// 	instance.setMediator({
	// 		notify() {
	// 			return range
	// 		}
	// 	})

	// TODO: jsdom的range应该有问题
	// 	instance.formatSelect('underline')

	// 	expect(container.innerHTML).toMatchInlineSnapshot()
	// })

	it('shoud format same block', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.innerHTML =
			'她还只是个孩子，躲在教堂的地下室里，听着外面传来的<span data-format-bold="true" style="font-weight: bold;">脚步声</span>和低语。那些声音不属于这个世界，它们来自一个被遗忘的<span data-format-italic="true" style="font-style: italic;">维度</span>。'

		const range = document.createRange()

		range.setStart(editable.childNodes[0], 5)
		range.setEnd(editable.childNodes[1].childNodes[0], 1) // ! 这里要选文字 !

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
