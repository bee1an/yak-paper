import { EditableKeydownBaseHandler } from './editable-keydown-base-handler'

/**
 * @description 回车事件处理者
 */
export class EditableKeydownEnterHandler extends EditableKeydownBaseHandler {
	handle(event: KeyboardEvent) {
		if (event.key !== 'Enter') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		// TODO:处理回车事件
		event.preventDefault()
	}
}
