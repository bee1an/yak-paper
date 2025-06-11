import { Colleague, type PaperMediator } from '../../paper/colleague'

/**
 * @description 一个包含所做输入的类型的字符串。有许多可能的值
 *
 * [Input Events Level 2 规范的属性部分](https://w3c.github.io/input-events/#interface-InputEvent-Attributes)
 */
enum InputType {
	/**
	 * @description 插入文本
	 */
	INSERT_TEXT = 'insertText',
	DELETE_CONTENT_BACKWARD = 'deleteContentBackward',
	DELETE_CONTENT_FORWARD = 'deleteContentForward'
}

const TRIGGER_COMMAND_MODE_CHAR = '/'

export class InputManager extends Colleague {
	constructor(private _?: PaperMediator) {
		super(_)
		this.handle = this.handle.bind(this)
	}

	handle(e: Event) {
		const event = e as InputEvent

		// 每次输入检查当前元素的内容
		const { inputType, data } = event

		const cmdIsActive = this._mediator.notify(this, 'public:cmdBoardIsActive')

		if (!cmdIsActive && data === TRIGGER_COMMAND_MODE_CHAR && inputType === InputType.INSERT_TEXT) {
			this._mediator.notify(this, 'public:setCmdBoardActive')
			this._mediator.notify(this, 'cmdRecordRange')
		}

		this._mediator.notify(this, 'public:cmdBoardIsActive') &&
			this._mediator.notify(this, 'cmdUpdate', event)

		//找到编辑元素
		const focusNode = this._mediator.notify(this, 'public:findEditableElement')!

		if (focusNode.textContent === '') {
			// 置空防止出现<br>
			focusNode.innerHTML = ''
		}
	}
}
