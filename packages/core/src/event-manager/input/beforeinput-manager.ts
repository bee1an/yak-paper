import { TRIGGER_COMMAND_MODE_CHAR } from '../../cmd-board-manager'
import { Colleague } from '../../paper/colleague'

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

export class BeforeinputManager extends Colleague {
	handle(event: InputEvent) {
		const { inputType, data } = event

		const cmdIsActive = this._mediator.notify('public:cmdBoardIsActive')

		if (!cmdIsActive && data === TRIGGER_COMMAND_MODE_CHAR && inputType === InputType.INSERT_TEXT) {
			this._mediator.notify('public:setCmdBoardActive')
			this._mediator.notify(this, 'cmdRecordRange')
		}
	}
}
