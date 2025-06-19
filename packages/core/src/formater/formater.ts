import { isEditable, type HProps } from '@yak-paper/utils'
import { Colleague } from '../paper/colleague'
import { Fragment, h, mergeProps, render } from 'vue'
import { SelectionManager } from '../selection-manager'

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

		const crossBlock = (selected[0] as HTMLElement).dataset?.blockType

		if (crossBlock) {
			// TODO 跨行
			return
		}

		const startParent = range.startContainer.parentNode as HTMLElement
		const endParent = range.endContainer.parentNode as HTMLElement

		/**
		 * 根据选中的内容返回新的格式化配置
		 *
		 * 具体实现
		 * 获取选区内容
		 * 根据选区内容获取新的配置
		 * 删除选区内容, 并根据新配置添加内容
		 *
		 * 不知道可行性, 此方案不行可以选择方案二, 根据选区开始焦点位置递归替换到结束位置
		 */

		const selectedFormat = [...selected]
			.map((node) => {
				// 如果节点没有文字, 则忽略这个节点
				if (node.textContent === '') {
					return null
				}

				let raw

				/**
				 * 如果是第一个元素且焦点的父元素并不是可编辑元素时
				 *
				 * 代表现在在一个样式文字中, 当前的节点需要继承父元素的样式(bold之类的)
				 * 并添加指定样式
				 */
				if (startParent === endParent && !isEditable(startParent)) {
					raw = extendsNodeStyle(startParent)

					raw.content = node.textContent ?? ''
				}
				// 如果节点是一个文字节点, 则返回指定样式的配置
				else if (node.nodeType === Node.TEXT_NODE) {
					raw = {
						type: [type],
						content: node.textContent ?? ''
					}
				}
				// 如果节点是一个span元素, 则当前节点需要新增样式
				else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
					raw = extendsNodeStyle(node)
				}

				function extendsNodeStyle(node: ChildNode) {
					const newRaw = Formater.minialNode2Raw(node) as RawFormat & { type: FormatType[] }
					newRaw.type.push(type)

					newRaw.type = [...new Set(newRaw.type)]
					return newRaw
				}

				return Formater.raw2Format(raw!)
			})
			.filter((item) => item !== null)

		// 根据格式化数据生成节点
		const children = Formater.format2Node(selectedFormat)

		// 获取操作完成后的焦点位置
		const rangeStartNode = children[0]
		const rangeEndNode = children[children.length - 1]

		/**
		 * 如果选区的焦点在样式节点中, 则需要将样式节点拆分, 防止节点嵌套
		 *
		 * 会在检查完焦点后删除原样式节点并插入一个新的样式节点, 但是内容看不出变化
		 */
		const head = getExtraInsert(startParent, 0, range.startOffset)
		head && children.unshift(...head)

		const tail = getExtraInsert(endParent, range.endOffset)
		tail && children.push(...tail)

		head && startParent.remove()
		tail && endParent.remove()

		range.deleteContents()

		// insertNode会将节点添加到开头, 所以需要反转一下
		children.reverse().forEach((item) => range.insertNode(item))

		// 设置焦点
		SelectionManager.selectNodesContent(range, [rangeStartNode, rangeEndNode])

		function getExtraInsert(parent: HTMLElement, start: number, end?: number) {
			if (!isEditable(parent)) {
				const clone = Formater.minialNode2Raw(parent)

				clone.content = parent.textContent!.slice(start, end)

				if (clone.content === '') return []

				return Formater.format2Node([Formater.raw2Format(clone)])
			}
		}
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
