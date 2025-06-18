import { BaseHandler } from './base-handler'

/**
 * @description 回车事件处理者
 */
export class EnterHandler extends BaseHandler {
	handle(event: KeyboardEvent) {
		if (event.code !== 'Enter') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		event.preventDefault()

		const inputCompositionState = this._notify('public:getInputCompositionState')
		if (inputCompositionState) return

		const range = this._notify('public:selection:getRange')

		if (range?.collapsed) {
			const section = this._notify('public:sections:findByFocused')!
			const { type, id, block } = section

			if (type !== 'text' && block!.isEmpty) {
				// 将当前元素转换为文本元素
				section.transformTo('text')
				section.tryFocus()
				return
			}

			this._notify(
				'public:creator:createNewLineByIndex',
				this._notify('public:sections:findIndexById', id) + 1,
				{ type }
			)
		} else {
			// 删除逻辑
		}
	}
}
