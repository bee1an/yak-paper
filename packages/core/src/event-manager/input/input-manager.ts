import type { SelectionManager } from '@yak-paper/core'

export class InputManager {
	constructor(private _inject: { selectionManager: SelectionManager }) {
		this.handle = this.handle.bind(this)
	}

	handle() {
		console.log('input')
		// 每次输入检查当前元素的内容

		//找到编辑元素
		const focusNode = this._inject.selectionManager.findEditableElement()!

		if (focusNode.textContent === '') {
			// 置空防止出现<br>
			focusNode.innerHTML = ''
		}
	}
}
