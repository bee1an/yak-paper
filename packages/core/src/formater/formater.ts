import {
	findChildElementIsEditable,
	getArrayHeadDeepestArray,
	getArrayTailDeepestArray,
	isEditable,
	type AnyFn,
	type HProps
} from '@yak-paper/utils'
import { Colleague } from '../paper/colleague'
import { Fragment, h, mergeProps, render } from 'vue'
import { SelectionManager } from '../selection-manager'

export const formatType = ['bold', 'underline', 'italic'] as const

export type FormatType = 'bold' | 'underline' | 'italic'

/**
 * 概念解释
 *
 * node(节点): 通常是一个纯文本或者是一个span的样式节点
 * nodeText(节点文本): 如果是span节点则是span的内容, 如果是纯文本则是等于node **还没有使用**
 * nodeRaw(原始数据): 对一个节点的原始描述
 * nodeOption(参数): 将raw处理为h函数认识的结果
 */

export interface NodeRaw {
	type: 'text' | FormatType[]

	/**
	 * @description 文本内容
	 */
	content: string
}

export type NodeOptionObj = {
	renderType: string

	children: string
} & { props: NonNullable<HProps> }

export type NodeOption = NodeOptionObj | string

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

	/**
	 * 将raw转换为format
	 */
	static raw2option(raw: NodeRaw): NodeOption {
		if (raw.type === 'text') {
			return raw.content
		}

		return raw.type.reduce((pre, item) => Formater.mergeOption(item, pre), {
			renderType: 'span',
			props: {},
			children: raw.content
		})
	}

	/**
	 * 将可编辑元素转换为raw
	 */
	static editable2raw(dom: HTMLElement): { formatRaw: NodeRaw[] } {
		const childNodes = [...dom.childNodes]

		const formatRaw = childNodes
			.map((node) => Formater.node2raw(node))
			.filter((item) => item !== null)

		// 返回包含格式化数据的对象
		return { formatRaw }
	}

	/**
	 * 将node转换为raw
	 */
	static node2raw(node: Node): NodeRaw | null {
		if (!node.textContent) return null

		if (node.nodeType === Node.TEXT_NODE) {
			return {
				type: 'text' as const,
				content: node.textContent
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
				content: node.textContent
			}
		}

		throw new Error('Unexpected node type')
	}

	/**
	 * 将format转换为node
	 */
	static option2node(format: NodeOption[]) {
		const host = document.createElement('div')
		render(
			h(
				Fragment,
				null,
				format.map((item) => {
					if (typeof item === 'string') {
						return item
					}
					return h(item.renderType, item.props, item.children)
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

	/**
	 * 合并format
	 */
	static mergeOption(type: FormatType, formatObj: NodeOptionObj) {
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

	/**
	 * 合并类型相同的raw
	 */
	static mergeSameTypeRaw(raw: NodeRaw[]): {
		FormatRaws: NodeRaw[]
		indexMerge: number[][]
	} {
		return raw.reduce<{
			FormatRaws: NodeRaw[]
			indexMerge: number[][]
		}>(
			(pre, i, index, arr) => {
				const { FormatRaws, indexMerge } = pre
				const item = { ...i }

				if (FormatRaws.length === 0) {
					FormatRaws.push(item)
					return pre
				}

				const { type } = arr[index - 1]

				const { type: curType, content } = item

				if (typeof type === 'string') {
					if (type !== curType) {
						FormatRaws.push(item)
						return pre
					}

					// 合并纯文字
					mergeRaw()
					return pre
				}

				const equal = type.length === curType.length && type.every((t) => curType.includes(t))

				if (!equal) {
					FormatRaws.push(item)
					return pre
				}

				// 合并样式节点
				mergeRaw()
				function mergeRaw() {
					const indexMerged = indexMerge.find((item) => item.includes(index - 1))
					indexMerged ? indexMerged.push(index) : indexMerge.push([index - 1, index])
					FormatRaws[FormatRaws.length - 1].content += content
				}

				return pre
			},
			{
				FormatRaws: [],
				indexMerge: []
			}
		)
	}

	/**
	 * 将指定节点格式化并转换为raw
	 */
	static convertNodes2raw(
		formatType: FormatType,
		nodes: ChildNode[],
		deformat?: boolean,
		extendsParent?: HTMLElement
	): NodeRaw[] {
		return nodes
			.map((node) => {
				// 如果节点没有文字, 则忽略这个节点
				if (node.textContent === '') {
					return null
				}

				let raw: NodeRaw & {
					type: FormatType[] | 'text'
				}

				// if (startParent === endParent && !isEditable(startParent)) {
				// 继承父元素的样式(bold之类的)
				if (extendsParent) {
					raw = extendsNodeType(extendsParent)

					raw.content = node.textContent ?? ''
				}
				// 如果节点是一个文字节点, 则返回指定样式的配置
				else if (node.nodeType === Node.TEXT_NODE && !deformat) {
					raw = {
						type: [formatType],
						content: node.textContent ?? ''
					}
				}
				// 如果节点是一个span元素, 则当前节点需要新增样式
				else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
					raw = extendsNodeType(node)
				} else {
					throw new Error('UnTreated node type')
				}

				if (raw.type.length === 0) {
					raw.type = 'text'
				}

				function extendsNodeType(node: ChildNode) {
					const newRaw = Formater.node2raw(node) as NodeRaw & { type: FormatType[] }
					newRaw.type.push(formatType)

					newRaw.type = [...new Set(newRaw.type)]

					if (deformat) {
						const index = newRaw.type.findIndex((type) => type === formatType)
						newRaw.type.splice(index, 1)
					}

					return newRaw
				}

				return raw
			})
			.filter((item) => item !== null)
	}

	/**
	 * 判断开头的合并情况
	 *
	 * 开头合并后需要将 焦点位置偏移量 和 焦点节点偏移量 修改
	 */
	private _headMerged(
		indexMerge: number[][],
		startFocusCursor: number,
		startFocusOffset: number,
		headRaw: NodeRaw[]
	) {
		const startMerged = indexMerge.find((index) => index.includes(startFocusCursor))

		if (startMerged) {
			/**
			 * 不关心焦点后合并了多少元素
			 *
			 * 这里用find是为了提前结束循环
			 */
			startMerged.find((i) => {
				const breakCondition = i >= startFocusCursor
				if (!breakCondition) {
					// 焦点位置偏移量需要增加焦点之前的元素的内容长度
					startFocusOffset += headRaw[i].content.length
					// 焦点节点偏移量需要减少焦点之前的元素的个数
					startFocusCursor--
				}
				return breakCondition
			})
		}
		return { startFocusCursor, startFocusOffset }
	}

	/**
	 * 同理_headMerged
	 */
	private _tailMerged(
		indexMerge: number[][],
		endFocusCursor: number,
		endFocusOffset: number,
		tailRaw: NodeRaw[]
	) {
		const endMerged = indexMerge.find((index) =>
			index.includes(tailRaw.length - 1 - endFocusCursor)
		)
		if (endMerged) {
			/**
			 * 这里的计算方式与_headMerged不同
			 * 焦点后的元素个数会影响焦点节点指针偏移量
			 */
			endMerged.forEach((i) => {
				// 焦点位置偏移量需要增加将焦点位置之前的元素的内容长度
				if (i < tailRaw.length - 1 - endFocusCursor) {
					endFocusOffset += tailRaw[i].content.length
				}

				// 焦点节点偏移量需要减少焦点**之后**的元素的个数
				else if (i > tailRaw.length - 1 - endFocusCursor) {
					endFocusCursor--
				}
			})
		}
		return { endFocusCursor, endFocusOffset }
	}

	/**
	 * 获取开头的补充元素
	 */
	private _headSupplement(
		node: ChildNode | null,
		raws: NodeRaw[],
		startFocusCursor: number,
		newContent?: string
	): [number, AnyFn | null] {
		let remove = null
		if (newContent === '' || !node) return [startFocusCursor, remove]

		const head = Formater.node2raw(node)

		if (!head) return [startFocusCursor, remove]

		newContent && (head.content = newContent)

		raws.unshift(head)
		// 开头插入了新的元素, 这个元素不会被选中, 则增加偏移量
		startFocusCursor++

		remove = () => node.remove()

		return [startFocusCursor, remove]
	}

	/**
	 * 同理_headSupplement
	 */
	private _tailSupplement(
		node: ChildNode | null,
		raws: NodeRaw[],
		endFocusCursor: number,
		newContent?: string
	): [number, AnyFn | null] {
		let remove = null

		if (newContent === '' || !node) return [endFocusCursor, remove]

		const tail = Formater.node2raw(node)

		if (!tail) return [endFocusCursor, remove]

		newContent && (tail.content = newContent)

		raws.push(tail)
		// 同理_headSupplement
		endFocusCursor++

		remove = () => node.remove()

		return [endFocusCursor, remove]
	}

	/**
	 * 跨行格式化
	 */
	crossBlockFormat(
		formatType: FormatType,
		contentSelected: NodeListOf<ChildNode>,
		deformat?: boolean
	) {
		const range = this._mediator.notify('public:selection:getRange')!

		// 过滤掉换行节点
		const selectedElement = Array.from(contentSelected).filter(
			(node) => node.nodeType === 1
		) as HTMLElement[]

		/**
		 * 格式化选中的元素中的可编辑元素的子节点
		 *
		 * 这是一个三维数组
		 *
		 * 第一层表示block
		 * 第二层表示block中包含的所有editable元素
		 * 第三层表示editable元素中的所有子节点的raw配置
		 */
		const formatted = selectedElement.map((element) => {
			return findChildElementIsEditable(element, { deep: true }).map((child) => {
				return Formater.convertNodes2raw(formatType, [...child.childNodes], deformat)
			})
		})

		const startParent = range.startContainer.parentNode as HTMLElement
		const endParent = range.endContainer.parentNode as HTMLElement

		// 获取前后焦点所在的节点
		const startTargetNode = isEditable(startParent) ? range.startContainer : startParent
		const endTargetNode = isEditable(endParent) ? range.endContainer : endParent

		// 获取多维数组首尾最深层的数组元素, 并根据返回值获取选区的开始结束节点
		const headRaw = getArrayHeadDeepestArray(formatted)
		const tailRaw = getArrayTailDeepestArray(formatted)

		/**
		 * 这里的焦点信息同理_sameBlockFormat
		 */
		let startFocusOffset = 0
		let endFocusOffset = tailRaw[tailRaw.length - 1].content.length
		let startFocusCursor = 0
		let endFocusCursor = 0

		;[startFocusCursor] = this._headSupplement(
			startTargetNode as ChildNode,
			headRaw,
			startFocusCursor,
			startTargetNode.textContent!.slice(0, range.startOffset)
		)
		;[endFocusCursor] = this._tailSupplement(
			endTargetNode as ChildNode,
			tailRaw,
			endFocusCursor,
			endTargetNode.textContent!.slice(range.endOffset)
		)

		// 如果在检索时直接删除获取插入元素会导致range错误, 所以需要将工作推迟执行
		const afterWorks: (() => any)[] = []

		let remove: AnyFn | null
		;[startFocusCursor, remove] = this._headSupplement(
			startTargetNode.previousSibling,
			headRaw,
			startFocusCursor
		)
		remove && afterWorks.push(remove)
		;[endFocusCursor, remove] = this._tailSupplement(
			endTargetNode.nextSibling,
			tailRaw,
			endFocusCursor
		)
		remove && afterWorks.push(remove)

		// 合并同类型节点
		const formattedMerged = formatted.map((item, i) =>
			item.map((_, index, array) => {
				const isHead = i === 0 && index === 0
				const isTail = i === formatted.length - 1 && index === array.length - 1

				const { FormatRaws, indexMerge } = Formater.mergeSameTypeRaw(_)

				if (isHead) {
					;({ startFocusCursor, startFocusOffset } = this._headMerged(
						indexMerge,
						startFocusCursor,
						startFocusOffset,
						headRaw
					))
				} else if (isTail) {
					;({ endFocusCursor, endFocusOffset } = this._tailMerged(
						indexMerge,
						endFocusCursor,
						endFocusOffset,
						tailRaw
					))
				}

				return FormatRaws
			})
		)

		// 获取开始位置的block
		let currentBlock = startParent.closest('[data-block-type]')!
		/**
		 * 根据格式化后的数据来获取页面中选中的元素
		 *
		 * 这样是准确的, 因为格式化数据是从选中内容获取的
		 */
		const headNodes: ChildNode[] = [],
			tailNodes: ChildNode[] = []
		formattedMerged.forEach((item, i) => {
			findChildElementIsEditable(currentBlock as HTMLElement, { deep: true }).forEach(
				(el, index, array) => {
					const editableFormat = item[index]

					// 删除掉所有与选区相交的元素
					el.childNodes.forEach((child) => {
						range.intersectsNode(child) && afterWorks.push(() => child.remove())
					})

					// 插入格式化后的新元素
					afterWorks.push(() => {
						const isHead = i === 0 && index === 0
						const isTail = i === formattedMerged.length - 1 && index === array.length - 1

						/**
						 * 这里如果不是最后一个块元素则直接插到末尾
						 *
						 * 如果是最后一个块元素则插到开头, 需要反转一下数据
						 */

						if (isTail) {
							for (let index = editableFormat.length; index--; ) {
								const [node] = Formater.option2node([Formater.raw2option(editableFormat[index])])

								tailNodes.unshift(node)

								el.insertBefore(node, el.childNodes[0])
							}
						} else {
							const nodes = Formater.option2node(
								editableFormat.map((item) => Formater.raw2option(item))
							)

							el.append(...nodes)

							isHead && headNodes.push(...nodes)
						}
					})
				}
			)

			// 遍历完成后检索下一个block
			currentBlock = currentBlock.nextElementSibling!
		})

		afterWorks.forEach((c) => c())

		// 更新选区
		SelectionManager.selectNodesByOffset(
			range,
			[headNodes[startFocusCursor], tailNodes[tailNodes.length - 1 - endFocusCursor]],
			startFocusOffset,
			endFocusOffset
		)
	}

	/**
	 * 单行格式化
	 */
	sameBlockFormat(
		formatType: FormatType,
		contentSelected: NodeListOf<ChildNode>,
		deformat?: boolean
	) {
		const range = this._mediator.notify('public:selection:getRange')!

		const startParent = range.startContainer.parentNode as HTMLElement
		const endParent = range.endContainer.parentNode as HTMLElement

		/**
		 * 根据选中的内容返回新的格式化配置
		 *
		 * 具体实现
		 * 获取选区内容
		 * 根据选区内容获取新的配置
		 * 删除选区内容, 并根据新配置添加内容
		 */
		const selectedRaw = Formater.convertNodes2raw(
			formatType,
			[...contentSelected],
			deformat,
			startParent === endParent && !isEditable(startParent) ? startParent : undefined
		)

		/**
		 * 焦点位置的节点
		 *
		 * 这个节点一定是可编辑元素的一级子元素
		 * 他可能是文本元素, 也可能是一个span元素
		 * 当他是一个文本元素时, 等于startParent
		 * end同理
		 *
		 * 获取这元素的目的是为了将这个元素中没有被选取的内容克隆一份, 并重新添加到操作需要新增的节点中
		 * 这样做可以防止节点嵌套, 以及合并节点
		 */
		const startTargetNode = isEditable(startParent) ? range.startContainer : startParent
		const endTargetNode = isEditable(endParent) ? range.endContainer : endParent

		/**
		 * 焦点位置偏移量
		 * 选区开始结束位置在节点中的偏移量
		 *
		 * 原始开始位置应该是格式化后的第一节点的第一个位置, 即0
		 * 原始结束位置应该是格式化后的最后一节点的最后一个位置, 即content.length
		 */
		let startFocusOffset = 0
		let endFocusOffset = selectedRaw[selectedRaw.length - 1].content.length

		/**
		 * 焦点节点偏移量
		 * 指向格式化后选区开始和结束的节点的指针偏移量
		 *
		 * 原始开始指针指向元素的第一个位置, 偏离量为0
		 * 原始结束指针指向元素的最后一个位置, 偏离量为0
		 *
		 * 这里要记录偏移量是因为最终生成的元素个数与现在的个数不一定一样, 可能存在同类元素合并的情况
		 */
		let startFocusCursor = 0
		let endFocusCursor = 0

		;[startFocusCursor] = this._headSupplement(
			startTargetNode as ChildNode,
			selectedRaw,
			startFocusCursor,
			startTargetNode.textContent!.slice(0, range.startOffset)
		)
		;[endFocusCursor] = this._tailSupplement(
			endTargetNode as ChildNode,
			selectedRaw,
			endFocusCursor,
			endTargetNode.textContent!.slice(range.endOffset)
		)

		let remove: AnyFn | null
			/**
			 * 获取前后连接处元素
			 * 用于合并同类节点
			 */
		;[startFocusCursor, remove] = this._headSupplement(
			startTargetNode.previousSibling,
			selectedRaw,
			startFocusCursor
		)
		remove?.()
		;[endFocusCursor, remove] = this._tailSupplement(
			endTargetNode.nextSibling,
			selectedRaw,
			endFocusCursor
		)
		remove?.()
		;(startTargetNode as ChildNode).remove()
		;(endTargetNode as ChildNode).remove()

		const { FormatRaws, indexMerge } = Formater.mergeSameTypeRaw(selectedRaw)

		;({ startFocusCursor, startFocusOffset } = this._headMerged(
			indexMerge,
			startFocusCursor,
			startFocusOffset,
			selectedRaw
		))
		;({ endFocusCursor, endFocusOffset } = this._tailMerged(
			indexMerge,
			endFocusCursor,
			endFocusOffset,
			selectedRaw
		))

		// 根据格式化数据生成节点
		const children = Formater.option2node(FormatRaws.map(Formater.raw2option))

		range.deleteContents()

		// insertNode会将节点添加到开头, 所以需要反转一下
		children.reverse().forEach((item) => range.insertNode(item))

		SelectionManager.selectNodesByOffset(
			range,
			[children[children.length - 1 - startFocusCursor], children[endFocusCursor]],
			startFocusOffset,
			endFocusOffset
		)
	}
}
