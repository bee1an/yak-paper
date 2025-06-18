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

		const section = this._notify('public:sections:findByFocused')!
		const { block, id, type } = section

		if (block!.isEmpty) {
			event.preventDefault()

			if (type !== 'text') {
				// 如果不是文字则转换为文字
				section.transformTo('text')
				section.tryFocus()
				return
			}

			const index = this._notify('public:sections:findIndexById', id)

			this._notify('public:sections:deleteByIndex', index)

			// 根据index判断选中上一个还是当前(当前index已经被下一个替代了)
			this._notify('public:sections:getByIndex', index - Number(!!index))?.tryFocus()
		}
	}
}
