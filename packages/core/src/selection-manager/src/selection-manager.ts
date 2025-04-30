export class SelectionManager {
	get selection() {
		return window.getSelection()
	}

	get range() {
		if (!this.selection) return null

		if (this.selection.rangeCount === 0) return null

		return this.selection.getRangeAt(0)
	}
}
