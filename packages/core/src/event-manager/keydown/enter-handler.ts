import type { EventEmitter } from '@yak-paper/utils'
import type { SelectionManager } from '../../selection-manager'
import { BaseHandler } from './base-handler'
import type { KeydownEvents, KeydownManager } from './keydown-manager'
import type { PaperMediator } from '../../paper'

export type KeydownEnterMediatorEvents = {
	getRange(): Range | null
	getInputCompositionState(): boolean
	findEditableElement: () => ReturnType<SelectionManager['findEditableElement']>
}

/**
 * @description 回车事件处理者
 */
export class EnterHandler extends BaseHandler {
	constructor(
		private _notify: <T extends keyof KeydownEnterMediatorEvents>(
			eventName: T,
			...args: Parameters<KeydownEnterMediatorEvents[T]>
		) => ReturnType<KeydownEnterMediatorEvents[T]>,

		private _emit: EventEmitter<KeydownEvents>['emit']
	) {
		super()
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

		const range = this._notify('getRange')

		if (range?.collapsed) {
			this._emit('newLine', event)
		} else {
			// 删除逻辑
		}
	}
}
