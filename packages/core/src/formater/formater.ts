import type { HProps } from '@yak-paper/utils'
import { Colleague } from '../paper/colleague'
import { Fragment, h, mergeProps, render } from 'vue'

export const formatType = ['bold', 'underline', 'italic'] as const

export type FormatType = 'bold' | 'underline' | 'italic'

export interface RawFormat {
	type: 'text' | FormatType[]

	/**
	 * @description 文本内容
	 */
	content: string
}

export type FormatObj = {
	tagName: string

	children: string
} & { props: NonNullable<HProps> }

export type FormatVal = FormatObj | string

export class Formater extends Colleague {
	private static _instance: Formater
	static getInstance() {
		if (!Formater._instance) {
			Formater._instance = new Formater()
		}

		return Formater._instance
	}
	private constructor() {
		super()
	}

	static raw2Format(raw: RawFormat): FormatVal {
		if (raw.type === 'text') {
			return raw.content
		}

		return raw.type.reduce((pre, item) => mergeFormat(item, pre), {
			tagName: 'span',
			props: {},
			children: raw.content
		})
	}

	static html2Raw(dom: HTMLElement): { format: RawFormat[] } {
		const childNodes = [...dom.childNodes]

		const format = childNodes.map((node) => Formater.minialNode2Raw(node))

		// 返回包含格式化数据的对象
		return { format }
	}

	static minialNode2Raw(node: ChildNode): RawFormat {
		if (node.nodeType === Node.TEXT_NODE) {
			return {
				type: 'text' as const,
				content: node.textContent ?? ''
			}
		}

		// 处理元素类型节点（需要包含dataset.format属性的HTML元素）
		if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
			const type: FormatType[] = []

			Object.keys((node as HTMLSpanElement).dataset).forEach((key) => {
				console.log('key', key)
				if (key.startsWith('format')) {
					const finded = formatType.find((item) => key.toLowerCase().includes(item))

					finded && type.push(finded)
				}
			})

			return {
				type,
				content: node.textContent ?? ''
			}
		}

		throw new Error('Unexpected node type')
	}

	static format2Node(format: FormatVal[]) {
		const host = document.createElement('div')
		render(
			h(
				Fragment,
				null,
				format.map((item) => {
					if (typeof item === 'string') {
						return item
					}
					return h(item.tagName, item.props, item.children)
				})
			),
			host
		)

		const children = [...host.childNodes]
		host.remove()

		children.shift()
		children.pop()

		return children
	}

	formatSelect(type: FormatType) {
		const range = this._mediator.notify('public:selection:getRange')

		if (!range) return

		const selected = range.cloneContents().childNodes

		const selectedFormat = [...selected]
			.map((node) => {
				if (node.textContent === '') {
					return null
				}

				let raw

				if (node.nodeType === Node.TEXT_NODE) {
					raw = {
						type: [type],
						content: node.textContent ?? ''
					}
				}

				const newRaw = Formater.minialNode2Raw(node) as RawFormat & { type: FormatType[] }

				if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
					newRaw.type.push(type)

					newRaw.type = [...new Set(newRaw.type)]

					raw = newRaw
				}

				return Formater.raw2Format(raw!)
			})
			.filter((item) => item !== null)

		const children = Formater.format2Node(selectedFormat)

		range.deleteContents()

		children.reverse().forEach((item) => range.insertNode(item))

		const start = children[children.length - 1].childNodes[0]
		range.setStart(start, 0)

		const end = children[0].childNodes[children[0].childNodes.length - 1]
		const endOffset = end.textContent!.length
		range.setEnd(end, endOffset)
	}
}

const mergeFormat = (type: FormatType, formatObj: FormatObj) => {
	switch (type) {
		// 生成带粗体样式的数据块格式
		case 'bold':
			formatObj.props = mergeProps(formatObj.props!, {
				'data-format-bold': true,
				style: {
					fontWeight: 'bold'
				}
			})

			break
		// 生成带下划线样式的文本格式
		case 'underline':
			formatObj.props = mergeProps(formatObj.props!, {
				'data-format-underline': true,
				style: {
					textDecoration: 'underline'
				}
			})

			break

		// 生成斜体文本格式
		case 'italic':
			formatObj.props = mergeProps(formatObj.props!, {
				'data-format-italic': true,
				style: {
					fontStyle: 'italic'
				}
			})
			break
		// 类型安全检查，确保处理了所有可能的类型
		default: {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _typeSecurity: never = type
			throw new Error('Unexpected format type')
		}
	}

	return formatObj
}
