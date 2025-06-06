import { BaseHandler } from './base-handler'

/**
 * @description 回车事件处理者
 */
export class BlobHandler extends BaseHandler {
	handle(event: KeyboardEvent) {
		if (
			event.code !== 'KeyB' ||
			!event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			event.metaKey
		) {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		// TODO:处理加粗
		event.preventDefault()
	}
}
