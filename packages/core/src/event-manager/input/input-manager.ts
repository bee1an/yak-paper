import { Colleague, type PaperMediator } from '../../paper'

export class InputManager extends Colleague {
	constructor(private _?: PaperMediator) {
		super(_)
		this.handle = this.handle.bind(this)
	}

	handle() {
		// 每次输入检查当前元素的内容

		//找到编辑元素
		const focusNode = this._mediator.notify(this as InputManager, 'findEditableElement')!

		if (focusNode.textContent === '') {
			// 置空防止出现<br>
			focusNode.innerHTML = ''
		}
	}
}
