import type { EventEmitter } from '@yak-paper/utils'
import type { SelectionManager } from '../../selection-manager'
import { BaseHandler } from './base-handler'
import type { KeydownEvents } from './keydown-manager'

export type KeydownEnterMediatorEvents = {
	getSelectionManager(): SelectionManager
	getRange(): Range | null
	getInputCompositionState(): boolean
	findEditableElement: () => ReturnType<SelectionManager['findEditableElement']>
}

type PvtNotify = <T extends keyof KeydownEnterMediatorEvents>(
	eventName: T,
	...args: Parameters<KeydownEnterMediatorEvents[T]>
) => ReturnType<KeydownEnterMediatorEvents[T]>

/**
 * @description 回车事件处理者
 */
export class EnterHandler extends BaseHandler {
	private _notify!: PvtNotify
	constructor(
		private _emit: EventEmitter<KeydownEvents>['emit'],
		notify?: PvtNotify
	) {
		super()
		notify && (this._notify = notify)
	}

	setNotify(notify: PvtNotify) {
		this._notify = notify
	}

	handle(event: KeyboardEvent) {
		if (event.code !== 'Enter') {
			// 交由下一个处理者处理
			super.handle(event)
			return
		}

		event.preventDefault()

		const inputCompositionState = this._notify('getInputCompositionState')
		if (inputCompositionState) return

		const selectionManager = this._notify('getSelectionManager')

		const range = selectionManager.getRange()

		if (range?.collapsed) {
			this._emit('newLine', selectionManager.findFocusedBlockId()!, event)
		} else {
			// 删除逻辑
		}
	}
}
