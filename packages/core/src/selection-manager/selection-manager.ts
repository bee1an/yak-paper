import { findChildElementIsEditable, getTextNodeBySite, isEditable } from '@yak-paper/utils'
import { Colleague } from '../paper/colleague'

export interface SelectContext {
	/** 是否跨行选中 */
	cross: boolean
	/** 选中的所有节点 */
	selectedNodes: ChildNode[] | ChildNode[][][]
	/** 选中的内容 */
	contentSelected: NodeListOf<ChildNode>
	/** 选区在特殊位置时的配置 */
	specialRange: {
		/** 选区位置在节点内部, 特指除了text外的节点 */
		isInNode: boolean
		/** isInNode === true 时的节点 */
		node: ChildNode | null
	}
}

export class SelectionManager extends Colleague {
	private static _instance: SelectionManager
	static getInstance() {
		if (!this._instance) {
			this._instance = new SelectionManager()
		}
		return this._instance
	}
	private constructor() {
		super()
	}

	/**
	 * 根据节点和偏移量选择节点
	 */
	static selectNodesByOffset(
		range: Range,
		nodes: [Node, Node],
		startOffset: number,
		endOffset: number
	) {
		const startText = getTextNodeBySite(nodes[0], 'first')
		const endText = getTextNodeBySite(nodes[nodes.length - 1], 'first')

		if (!startText || !endText) return

		range.collapse()
		range.setStart(startText, startOffset)
		range.setEnd(endText, endOffset)
	}

	/**
	 * 选中节点内容
	 */
	static selectNodesContent(range: Range, nodes: Node[]) {
		const startText = getTextNodeBySite(nodes[0], 'first')
		const endText = getTextNodeBySite(nodes[nodes.length - 1], 'first')

		if (!startText || !endText) return

		const endOffset = endText.textContent!.length

		range.setStart(startText, 0)
		range.setEnd(endText, endOffset)
	}

	/**
	 * 获取总选区对象
	 */
	static getSelection() {
		return window.getSelection()
	}

	/**
	 * 获取选区对象
	 */
	static getRange() {
		const selection = SelectionManager.getSelection()

		if (!selection) return null

		if (selection.rangeCount === 0) return null

		return selection.getRangeAt(0)
	}

	/**
	 * 创建一个选区
	 */
	static createRange() {
		const range = document.createRange()

		return range
	}

	/**
	 * 找到当前光标所在的编辑元素
	 */
	static findEditableElement(): HTMLElement | null {
		const range = SelectionManager.getRange()

		if (!range?.collapsed) return null

		return range.startContainer as HTMLElement
	}

	/**
	 * 找到当前聚焦的块元素
	 */
	static findFocusedBlock(): HTMLElement | null {
		let editable = SelectionManager.findEditableElement()

		if (!editable) return null

		if (editable.nodeType === Node.TEXT_NODE) {
			editable = editable.parentElement as HTMLElement
		}

		return editable.closest('[data-block-type]') as HTMLElement
	}

	/**
	 * 找到当前聚焦的块元素id
	 */
	static findFocusedBlockId(): string | null | undefined {
		const block = SelectionManager.findFocusedBlock()

		if (!block) return null

		return block.dataset.blockId
	}

	/**
	 * 判断是否跨行选择
	 */
	static corssSelect(range?: Range | null): boolean {
		range ??= SelectionManager.getRange()

		if (!range) throw new Error('range is null')

		if (range.collapsed) return false

		const selectedContent = range.cloneContents().childNodes

		return !!(
			selectedContent[0].nodeType === Node.ELEMENT_NODE &&
			(selectedContent[0] as HTMLElement).dataset.blockType
		)
	}

	lastSelectContext: SelectContext | null = null
	/**
	 * 获取选取选择上下文
	 */
	getRangeSelectContext(): SelectContext | null {
		const range = SelectionManager.getRange()

		if (!range) return null

		const cross = SelectionManager.corssSelect()

		const contentSelected = range.cloneContents().childNodes

		let selectedNodes

		const startParent = range.startContainer.parentNode as HTMLElement
		const endParent = range.endContainer.parentNode as HTMLElement

		if (cross) {
			// 过滤掉换行节点
			const selectedElement = Array.from(contentSelected).filter(
				(node) => node.nodeType === 1
			) as HTMLElement[]

			selectedNodes = selectedElement.map((element) => {
				return findChildElementIsEditable(element, { deep: true }).map((child) => {
					return [...child.childNodes]
				})
			})
		} else {
			selectedNodes = [...contentSelected]
		}

		const isInNode = startParent === endParent && !isEditable(startParent)
		this.lastSelectContext = {
			cross,
			selectedNodes,
			specialRange: {
				isInNode,
				node: isInNode ? startParent : null
			},
			contentSelected
		}

		return this.lastSelectContext
	}
}
