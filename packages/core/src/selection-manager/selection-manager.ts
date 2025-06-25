import { getTextNodeBySite } from '@yak-paper/utils'

export class SelectionManager {
	private static _instance: SelectionManager
	static getInstance() {
		if (!this._instance) {
			this._instance = new SelectionManager()
		}
		return this._instance
	}
	private constructor() {}

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

	static selectNodesContent(range: Range, nodes: Node[]) {
		const startText = getTextNodeBySite(nodes[0], 'first')
		const endText = getTextNodeBySite(nodes[nodes.length - 1], 'first')

		if (!startText || !endText) return

		const endOffset = endText.textContent!.length

		range.setStart(startText, 0)
		range.setEnd(endText, endOffset)
	}

	getSelection() {
		return window.getSelection()
	}

	getRange() {
		const selection = this.getSelection()

		if (!selection) return null

		if (selection.rangeCount === 0) return null

		return selection.getRangeAt(0)
	}

	createRange() {
		const range = document.createRange()

		return range
	}

	isCollapsed() {
		return this.getRange()?.collapsed ?? true
	}

	/** @description 找到当前光标所在的编辑元素 */
	findEditableElement(): HTMLElement | null {
		const range = this.getRange()

		if (!range?.collapsed) return null

		return range.startContainer as HTMLElement
	}

	/** @description 找到当前聚焦的块元素 */
	findFocusedBlock(): HTMLElement | null {
		let editable = this.findEditableElement()

		if (!editable) return null

		if (editable.nodeType === Node.TEXT_NODE) {
			editable = editable.parentElement as HTMLElement
		}

		return editable.closest('[data-block-type]') as HTMLElement
	}

	/** @description 找到当前聚焦的块元素id */
	findFocusedBlockId(): string | null | undefined {
		const block = this.findFocusedBlock()

		if (!block) return null

		return block.dataset.blockId
	}
}
