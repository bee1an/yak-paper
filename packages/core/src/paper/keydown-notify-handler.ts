import type { KeydownManager } from '../event-manager'
import { NotifyHandler } from './notify-handler'

export type KeydownNotifyEvents = {}

export class KeydownNotifyHandler extends NotifyHandler {
	handle<T extends KeydownManager, K extends keyof KeydownNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<KeydownNotifyEvents[K]>
	): ReturnType<KeydownNotifyEvents[K]> {
		if (s !== this._paper.keydownManager) {
			return super.handle(s, event, ...args) as any
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: never = event

		throw new Error('No handler')
	}
}
