export class SelectionManager {
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

	/** @description 找到当前光标所在的编辑元素 */
	findEditableElement(): HTMLElement | null {
		const range = this.getRange()

		if (!range?.collapsed) return null

		return range.startContainer as HTMLElement
	}
}
