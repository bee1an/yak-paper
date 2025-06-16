import { Colleague, type PaperMediator } from '../../paper/colleague'

export class InputManager extends Colleague {
	constructor(private _?: PaperMediator) {
		super(_)
		this.handle = this.handle.bind(this)
	}

	handle(event: InputEvent) {
		//找到编辑元素
		const focusNode = this._mediator.notify('public:selection:findEditableElement')!

		this._mediator.notify('public:cmdBoardIsActive') &&
			this._mediator.notify(this, 'cmdUpdate', event)

		if (focusNode.textContent === '') {
			// 置空防止出现<br>
			focusNode.innerHTML = ''
		}
	}
}
