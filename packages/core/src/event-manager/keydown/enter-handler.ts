import type { EventEmitter } from '@yak-paper/utils'
import { BaseHandler } from './base-handler'
import type { KeydownEvents } from './keydown-manager'
import type { KeydownManagerNotifyEvents, PublicNotifyEvent } from '../../paper/colleague'

type PvtNotify = <T extends keyof (KeydownManagerNotifyEvents & PublicNotifyEvent)>(
	eventName: T,
	...args: Parameters<KeydownManagerNotifyEvents & PublicNotifyEvent[T]>
) => ReturnType<KeydownManagerNotifyEvents & PublicNotifyEvent[T]>

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

		const inputCompositionState = this._notify('public:getInputCompositionState')
		if (inputCompositionState) return

		// TODO
		const range = this._notify('public:selection:getRange')

		if (range?.collapsed) {
			this._emit('newLine', this._notify('public:selection:findFocusedBlockId')!, event)
		} else {
			// 删除逻辑
		}
	}
}
