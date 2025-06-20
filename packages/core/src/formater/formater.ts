import {
	findChildElementIsEditable,
	getArrayHeadDeepestArray,
	getArrayTailDeepestArray,
	isEditable,
	type HProps
} from '@yak-paper/utils'
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

	static minialNode2Raw(node: Node): RawFormat {
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

	private _formatSpecifiedNodes(
		formatType: FormatType,
		nodes: ChildNode[],
		extendsParent?: HTMLElement
	) {
		return nodes
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
				// if (startParent === endParent && !isEditable(startParent)) {
				if (extendsParent) {
					raw = extendsNodeStyle(extendsParent)

					raw.content = node.textContent ?? ''
				}
				// 如果节点是一个文字节点, 则返回指定样式的配置
				else if (node.nodeType === Node.TEXT_NODE) {
					raw = {
						type: [formatType],
						content: node.textContent ?? ''
					}
				}
				// 如果节点是一个span元素, 则当前节点需要新增样式
				else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
					raw = extendsNodeStyle(node)
				}

				function extendsNodeStyle(node: ChildNode) {
					const newRaw = Formater.minialNode2Raw(node) as RawFormat & { type: FormatType[] }
					newRaw.type.push(formatType)

					newRaw.type = [...new Set(newRaw.type)]
					return newRaw
				}

				return Formater.raw2Format(raw!)
			})
			.filter((item) => item !== null)
	}

	private _cloneNodeFormat(node: Node, content: string) {
		const clone = Formater.minialNode2Raw(node)

		clone.content = content

		if (clone.content === '') return []

		return Formater.format2Node([Formater.raw2Format(clone)])
	}

	/**
	 * 跨行格式化
	 */
	// TODO: improve preformance
	private _crossBlockFormat(
		range: Range,
		formatType: FormatType,
		selectedNode: NodeListOf<ChildNode>
	) {
		// 过滤掉换行节点
		const selectedElement = Array.from(selectedNode).filter(
			(node) => node.nodeType === 1
		) as HTMLElement[]

		const startParent = range.startContainer.parentNode as HTMLElement
		const endParent = range.endContainer.parentNode as HTMLElement

		/**
		 * 格式化选中的元素中的可编辑元素的子节点
		 *
		 * 这是一个三维数组
		 *
		 * 第一层表示block
		 * 第二层表示block中包含的所有editable元素
		 * 第三层表示editable元素中的所有子节点
		 */

		const formated = selectedElement.map((element) => {
			return findChildElementIsEditable(element, { deep: true }).map((child) => {
				return Formater.format2Node(this._formatSpecifiedNodes(formatType, [...child.childNodes]))
			})
		})

		/**
		 * 获取焦点前后位置的父节点
		 *
		 * 如果父节点是可编辑元素, 代表当前焦点在最外层的文字节点中
		 *
		 * 如果不是可编辑元素, 则需要克隆父元素样式
		 */
		const startCloneTarget = isEditable(startParent) ? range.startContainer : startParent
		const endCloneTarget = isEditable(endParent) ? range.endContainer : endParent

		// 获取多维数组收尾最深层的数组元素, 并根据返回值获取选区的开始结束节点
		const headArr = getArrayHeadDeepestArray(formated)
		const focusStartNode = headArr[0]
		const tailArr = getArrayTailDeepestArray(formated)
		const focusEndNode = tailArr[tailArr.length - 1]

		// 需要焦点前后位置的节点克隆一份, 便于替换
		const head = this._cloneNodeFormat(
			startCloneTarget,
			startCloneTarget.textContent!.slice(0, range.startOffset)
		)
		headArr.unshift(...head)

		const tail = this._cloneNodeFormat(
			endCloneTarget,
			endCloneTarget.textContent!.slice(range.endOffset)
		)
		tailArr.push(...tail)

		// 获取开始位置的block
		let currentBlock = startParent.closest('[data-block-type]')!

		// 如果在检索时直接删除获取插入元素会导致range错误, 所以需要将工作推迟执行
		const afterWorks: (() => any)[] = []

		/**
		 * 根据格式化后的数据来获取页面中选中的元素
		 * 这样是准确的, 因为格式化数据是从选中内容获取的
		 */
		formated.forEach((item, i) => {
			findChildElementIsEditable(currentBlock as HTMLElement, { deep: true }).forEach(
				(el, index) => {
					const editableFormat = item[index]

					// 删除掉所有与选区相交的元素
					el.childNodes.forEach((child) => {
						range.intersectsNode(child) && afterWorks.push(() => child.remove())
					})

					// 插入格式化后的新元素
					afterWorks.push(() => {
						/**
						 * 这里如果不是最后一个块元素则直接插到末尾
						 *
						 * 如果是最后一个块元素则插到开头, 需要反转一下数据
						 */
						i === formated.length - 1
							? editableFormat.reverse().forEach((item) => el.insertBefore(item, el.childNodes[0]))
							: el.append(...editableFormat)
					})
				}
			)

			// 遍历完成后检索下一个block
			currentBlock = currentBlock.nextElementSibling!
		})
		afterWorks.forEach((c) => c())

		console.log('123', focusStartNode, focusEndNode)
		// 更新选区
		SelectionManager.selectNodesContent(range, [focusStartNode, focusEndNode])
	}

	/**
	 * 单行格式化
	 */
	private _sameBlockFormat(
		range: Range,
		formatType: FormatType,
		selectedNode: NodeListOf<ChildNode>
	) {
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

		const selectedFormat = this._formatSpecifiedNodes(
			formatType,
			[...selectedNode],
			startParent === endParent && !isEditable(startParent) ? startParent : undefined
		)

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
		const head =
			!isEditable(startParent) &&
			this._cloneNodeFormat(startParent, startParent.textContent!.slice(0, range.startOffset))
		head && children.unshift(...head)

		const tail =
			!isEditable(endParent) &&
			this._cloneNodeFormat(endParent, endParent.textContent!.slice(range.endOffset))
		tail && children.push(...tail)

		head && startParent.remove()
		tail && endParent.remove()

		range.deleteContents()

		// insertNode会将节点添加到开头, 所以需要反转一下
		children.reverse().forEach((item) => range.insertNode(item))

		// 设置焦点
		SelectionManager.selectNodesContent(range, [rangeStartNode, rangeEndNode])
	}

	formatSelect(type: FormatType) {
		const range = this._mediator.notify('public:selection:getRange')

		if (!range) return

		const selectedNode = range.cloneContents().childNodes

		const crossBlock = (selectedNode[0] as HTMLElement).dataset?.blockType

		crossBlock
			? this._crossBlockFormat(range, type, selectedNode)
			: this._sameBlockFormat(range, type, selectedNode)
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
