import { describe, expect, it } from 'vitest'
import { Formater, type FormatType, type NodeRaw } from '../src/formater/formater'
import { SelectionManager } from '@yak-paper/core/src/selection-manager'
import { getChildrenNode } from '@yak-paper/utils/src/dom'

describe('formater', () => {
	const raw = [
		{
			type: 'text',
			content: '她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a'
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

	const raw2 = [
		{
			type: 'text',
			content:
				'“你以为时间会抹去一切，但有些东西……它只是在等待。” 那熟悉的声音再次响起，带着一种令人心悸的平静。'
		}
	] as NodeRaw[]
	const raw3 = [
		{
			type: 'text',
			content:
				'她终于转过身来，看着那个站在阴影中的身影。他穿着一袭深色风衣，脸上布满岁月的痕迹，却依旧保持着当年那种令人敬畏的 b'
		},
		{
			type: ['italic'],
			content: '气场'
		},
		{
			type: 'text',
			content: '。'
		}
	] as NodeRaw[]

	function formatSelect(range: Range, type: FormatType, formater: Formater, deformat?: boolean) {
		if (!range) return

		const selectedNode = range.cloneContents().childNodes

		const crossBlock = (selectedNode[0] as HTMLElement).dataset?.blockType

		crossBlock
			? formater.crossBlockFormat(type, selectedNode, deformat)
			: formater.sameBlockFormat(type, selectedNode, deformat)
	}

	it('shoud deformat same block', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.append(...Formater.option2node(raw.map((_) => Formater.raw2option(_))))

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a,
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

		const range = document.createRange()
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
		formatSelect(range, 'bold', instance, true)

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    脚
			  </span>,
			  步,
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
			[editable.childNodes[0], editable.childNodes[editable.childNodes.length - 1]],
			0,
			editable.childNodes[editable.childNodes.length - 1].textContent!.length
		)

		formatSelect(range, 'bold', instance)
		formatSelect(range, 'italic', instance)
		formatSelect(range, 'underline', instance)
		formatSelect(range, 'bold', instance, true)
		formatSelect(range, 'italic', instance, true)
		formatSelect(range, 'underline', instance, true)
		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a脚步声和低语。那些声音不属于这个世界，它们来自一个被遗忘的维度。,
			]
		`)
	})

	it('shoud format cross block', () => {
		const container = document.createElement('div')
		const section = document.createElement('section')
		section.dataset.blockType = 'text'
		const editable = document.createElement('div')
		editable.contentEditable = 'true'
		editable.setAttribute('data-block-id', '1')
		editable.append(...Formater.option2node(raw.map((_) => Formater.raw2option(_))))

		section.appendChild(editable)
		const section2 = document.createElement('section')
		section2.dataset.blockType = 'text'
		const editable2 = document.createElement('div')
		editable2.contentEditable = 'true'
		editable2.append(...Formater.option2node(raw2.map((_) => Formater.raw2option(_))))

		section2.appendChild(editable2)
		const section3 = document.createElement('section')
		section3.dataset.blockType = 'text'
		const editable3 = document.createElement('div')
		editable3.contentEditable = 'true'
		editable3.append(...Formater.option2node(raw3.map((_) => Formater.raw2option(_))))

		section3.appendChild(editable3)
		container.append(section, section2, section3)

		expect(container.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  <section
			    data-block-type="text"
			  >
			    <div
			      data-block-id="1"
			    >
			      她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a
			      <span
			        data-format-bold="true"
			        style="font-weight: bold;"
			      >
			        脚步声
			      </span>
			      和低语。那些声音不属于这个世界，它们来自一个被遗忘的
			      <span
			        data-format-italic="true"
			        style="font-style: italic;"
			      >
			        维度
			      </span>
			      。
			    </div>
			  </section>,
			  <section
			    data-block-type="text"
			  >
			    <div>
			      “你以为时间会抹去一切，但有些东西……它只是在等待。” 那熟悉的声音再次响起，带着一种令人心悸的平静。
			    </div>
			  </section>,
			  <section
			    data-block-type="text"
			  >
			    <div>
			      她终于转过身来，看着那个站在阴影中的身影。他穿着一袭深色风衣，脸上布满岁月的痕迹，却依旧保持着当年那种令人敬畏的 b
			      <span
			        data-format-italic="true"
			        style="font-style: italic;"
			      >
			        气场
			      </span>
			      。
			    </div>
			  </section>,
			]
		`)

		const range = document.createRange()
		const blockSpan = container.querySelector('[data-format-bold="true"]')

		expect(blockSpan!.childNodes[0]).toMatchInlineSnapshot(`脚步声`)
		range.setStart(blockSpan!.childNodes[0], 1)

		const italicSpan = container.querySelectorAll('[data-format-italic="true"]')[1]
		expect(italicSpan!.childNodes[0]).toMatchInlineSnapshot(`气场`)
		range.setEnd(italicSpan!.childNodes[0], 1)

		const selection = getSelection()
		selection?.removeAllRanges()
		selection?.addRange(range)

		const instance = Formater.getInstance()
		// 模拟一个中介者
		instance.setMediator({
			notify() {
				return range
			}
		})

		/**
		 * 多行测试jsdom有bug
		 *
		 * 通过range对象复制出来的contenteditable元素  contentEditable属性丢失
		 */
		// formatSelect(range, 'underline', instance)
	})

	it('shoud format same block 3', () => {
		const editable = document.createElement('div')
		editable.contentEditable = 'true'

		editable.append(...Formater.option2node(raw.map((_) => Formater.raw2option(_))))
		const range = document.createRange()

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a,
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
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a,
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
		formatSelect(range, 'bold', instance)
		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], editable.childNodes[4]],
			editable.childNodes[0].textContent!.length - 3,
			2
		)
		formatSelect(range, 'italic', instance)

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，听着外,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    面传来
			  </span>,
			  <span
			    data-format-bold="true"
			    data-format-italic="true"
			    style="font-weight: bold; font-style: italic;"
			  >
			    的 a脚步声和低
			  </span>,
			  <span
			    data-format-italic="true"
			    style="font-style: italic;"
			  >
			    语。
			  </span>,
			  那些声音不属于这个世界，它们来自一个被遗忘的,
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
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a,
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
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"的 a脚步声"`)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[2], editable.childNodes[2]],
			0,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"的 a脚步声和低语"`)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], getChildrenNode(editable.childNodes[1])[0]],
			editable.childNodes[0].textContent!.length - 3,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"面传来的 a脚步声和低语"`)

		SelectionManager.selectNodesByOffset(
			range,
			[getChildrenNode(editable.childNodes[1])[0], editable.childNodes[2]],
			getChildrenNode(editable.childNodes[1])[0].textContent!.length - 3,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(`"面传来的 a脚步声和低语。那些"`)

		SelectionManager.selectNodesByOffset(
			range,
			[editable.childNodes[0], editable.childNodes[2]],
			editable.childNodes[0].textContent!.length - 3,
			3
		)
		formatSelect(range, 'bold', instance)
		expect(editable.children[0].textContent).toMatchInlineSnapshot(
			`"听着外面传来的 a脚步声和低语。那些声音不"`
		)

		expect(editable.childNodes).toMatchInlineSnapshot(`
			NodeList [
			  她还只是个孩子，躲在教堂的地下室里，,
			  <span
			    data-format-bold="true"
			    style="font-weight: bold;"
			  >
			    听着外面传来的 a脚步声和低语。那些声音不
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
			    孩子，躲在教堂的地下室里，听着外面传来的 a脚步声
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
			    孩子，躲在教堂的地下室里，听着外面传来的 a脚步声
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
			  她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a,
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
			  "她还只是个孩子，躲在教堂的地下室里，听着外面传来的 a",
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
