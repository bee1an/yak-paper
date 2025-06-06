import type { EventEmitter } from '@yak-paper/utils'
import type { SelectionManager } from '../../selection-manager'
import { EditableKeydownBaseHandler } from './editable-keydown-base-handler'
import type { EditableKeydownEvents } from './editable-keydown-manager'

/**
 * @description 回车事件处理者
 */
export class EditableKeydownEnterHandler extends EditableKeydownBaseHandler {
	constructor(
		private _inject: {
			selectionManager: SelectionManager
			emit: EventEmitter<EditableKeydownEvents>['emit']
		}
	) {
		super()
	}

	private get _selectionManager() {
		return this._inject.selectionManager
	}

	handle(event: KeyboardEvent) {
		if (event.code !== 'Enter') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		event.preventDefault()

		const range = this._selectionManager.getRange()

		if (range?.collapsed) {
			this._inject.emit('newLine', event)
		} else {
			// 删除逻辑
		}
	}
}
