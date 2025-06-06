import { BaseHandler } from './base-handler'

/**
 * @description 回车事件处理者
 */
export class DeleteHandler extends BaseHandler {
	handle(event: KeyboardEvent) {
		if (event.code !== 'Backspace') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		// event.preventDefault()
	}
}
