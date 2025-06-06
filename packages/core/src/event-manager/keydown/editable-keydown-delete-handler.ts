import { EditableKeydownBaseHandler } from './editable-keydown-base-handler'

/**
 * @description 回车事件处理者
 */
export class EditableKeydownDeleteHandler extends EditableKeydownBaseHandler {
	handle(event: KeyboardEvent) {
		if (event.code !== 'Backspace') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		// event.preventDefault()
	}
}
