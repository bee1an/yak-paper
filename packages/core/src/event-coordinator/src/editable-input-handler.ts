export class EditableWhenInput {
	private static _instance: EditableWhenInput

	private constructor() {
		this.handle = this.handle.bind(this)
	}
	static get instance() {
		if (!this._instance) {
			this._instance = new EditableWhenInput()
		}
		return this._instance
	}

	handle(event: Event) {
		if (!(event.target instanceof HTMLElement)) return

		const target = event.target

		// 每次输入检查当前元素的内容
		// console.log('target', target.textContent)

		if (target.textContent === '') {
			// 置空防止出现<br>
			target.textContent = ''
		}
	}
}
