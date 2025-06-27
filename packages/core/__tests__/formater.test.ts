import { describe, expect, it } from 'vitest'
import { Formater, type FormatType, type NodeRaw } from '../src/formater/formater'
import { SelectionManager } from '@yak-paper/core/src/selection-manager'
import { getChildrenNode } from '@yak-paper/utils/src/dom'

describe('formater', () => {
	const raw = [
		{
			type: 'text',
			content: '她还只是个孩子，躲在教堂的地下室里，听着外面传来的 '
		},
		{
			type: ['bold'],
			content: '脚步声'
		},
		{
			type: 'text',
			content: '和低语。那些声音不属于这个世界，它们来自一个被遗忘的'
		},
		{
			type: ['italic'],
			content: '维度'
		},
		{
			type: 'text',
			content: '。'
		}
	] as NodeRaw[]

	function formatSelect(range: Range, type: FormatType, formater: Formater) {
		if (!range) return

		const selectedNode = range.cloneContents().childNodes

		const crossBlock = (selectedNode[0] as HTMLElement).dataset?.blockType

		crossBlock
			? formater.crossBlockFormat(type, selectedNode)
			: formater.sameBlockFormat(type, selectedNode)
	}

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

	it('shoud format same block 3', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.append(...Formater.option2node(raw.map((_) => Formater.raw2option(_))))
		const range = document.createRange()

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 ,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    脚步声
			  </span>,
			  和低语。那些声音不属于这个世界，它们来自一个被遗忘的,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			  。,
			]
		`)
		const instance = Formater.getInstance()
		// 模拟一个中介者
		instance.setMediator({
			notify() {
				return range
			}
		})

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[1], editable.childNodes[1]],
			1,
			2
		)
		formatSelect(range, 'italic', instance)

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 ,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    脚
			  </span>,
			  <span
			    data-format-bold="true"
			    data-format-italic="true"
			    style="font-weight: bold; font-style: italic;"
			  >
			    步
			  </span>,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    声
			  </span>,
			  和低语。那些声音不属于这个世界，它们来自一个被遗忘的,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			  。,
			]
		`)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], editable.childNodes[4]],
			editable.childNodes[0].textContent!.length - 3,
			2
		)
		formatSelect(range, 'italic', instance)

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    来的 
			  </span>,
			  <span
			    data-format-bold="true"
			    data-format-italic="true"
			    style="font-weight: bold; font-style: italic;"
			  >
			    脚步声
			  </span>,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    和低
			  </span>,
			  语。那些声音不属于这个世界，它们来自一个被遗忘的,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			  。,
			]
		`)
	})

	it('shoud format same block 2', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.append(...Formater.option2node(raw.map((_) => Formater.raw2option(_))))
		const range = document.createRange()

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 ,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    脚步声
			  </span>,
			  和低语。那些声音不属于这个世界，它们来自一个被遗忘的,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			  。,
			]
		`)
		const instance = Formater.getInstance()
		// 模拟一个中介者
		instance.setMediator({
			notify() {
				return range
			}
		})

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], editable.childNodes[0]],
			editable.childNodes[0].textContent!.length - 3,
			editable.childNodes[0].textContent!.length
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"来的 脚步声"`)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[2], editable.childNodes[2]],
			0,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"来的 脚步声和低语"`)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], getChildrenNode(editable.childNodes[1])[0]],
			editable.childNodes[0].textContent!.length - 3,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"外面传来的 脚步声和低语"`)

		SelectionManager.selectNodesByOffset(
			range,
			[getChildrenNode(editable.childNodes[1])[0], editable.childNodes[2]],
			getChildrenNode(editable.childNodes[1])[0].textContent!.length - 3,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(
			`"外面传来的 脚步声和低语。那些"`
		)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], editable.childNodes[2]],
			editable.childNodes[0].textContent!.length - 3,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(
			`"，听着外面传来的 脚步声和低语。那些声音不"`
		)

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    ，听着外面传来的 脚步声和低语。那些声音不
			  </span>,
			  属于这个世界，它们来自一个被遗忘的,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			  。,
			]
		`)
	})

	it('shoud format same block', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.append(...Formater.option2node(raw.map((_) => Formater.raw2option(_))))

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

		formatSelect(range, 'bold', instance)
		expect(editable.children).toMatchInlineSnapshot(`
			HTMLCollection [
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    孩子，躲在教堂的地下室里，听着外面传来的 脚步声
			  </span>,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			]
		`)

		range.setStart(editable.childNodes[0], 1)
		range.setEnd(editable.childNodes[0], 2)

		formatSelect(range, 'italic', instance)

		expect(editable.children).toMatchInlineSnapshot(`
			HTMLCollection [
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    还
			  </span>,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    孩子，躲在教堂的地下室里，听着外面传来的 脚步声
			  </span>,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			]
		`)
	})

	it('shoud return node from format', () => {
		expect(Formater.option2node(raw.map((_) => Formater.raw2option(_)))).toMatchInlineSnapshot(`
			[
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 ,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    脚步声
			  </span>,
			  和低语。那些声音不属于这个世界，它们来自一个被遗忘的,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    维度
			  </span>,
			  。,
			]
		`)
	})

	it('shoud 2 format', () => {
		expect(raw.map((_) => Formater.raw2option(_))).toMatchInlineSnapshot(`
			[
			  "她还只是个孩子，躲在教堂的地下室里，听着外面传来的 ",
			  {
			    "children": "脚步声",
			    "props": {
			      "data-format-bold": true,
			      "style": {
			        "fontWeight": "bold",
			      },
			    },
			    "tagName": "span",
			  },
			  "和低语。那些声音不属于这个世界，它们来自一个被遗忘的",
			  {
			    "children": "维度",
			    "props": {
			      "data-format-italic": true,
			      "style": {
			        "fontStyle": "italic",
			      },
			    },
			    "tagName": "span",
			  },
			  "。",
			]
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

		expect(Formater.editable2raw(dom)).toMatchInlineSnapshot(`
			{
			  "formatRaw": [
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
