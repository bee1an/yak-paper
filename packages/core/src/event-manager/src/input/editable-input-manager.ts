export class EditableInputManager {
	constructor() {
		this.handle = this.handle.bind(this)
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
