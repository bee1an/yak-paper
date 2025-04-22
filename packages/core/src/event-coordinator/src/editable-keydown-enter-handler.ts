import { EditableKeydownBaseHandler } from './editable-keydown-base-handler'

/**
 * @description 回车事件处理者
 */
export class EditableKeydownEnterHandler extends EditableKeydownBaseHandler {
	handle(event: KeyboardEvent) {
		if (event.code !== 'Enter') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		event.preventDefault()

		this._eventBus.emit('enter', event)
	}
}
