import type { BeforeinputManager } from '../event-manager'
import { NotifyHandler } from './notify-handler'

export type BeforeinputNotifyEvents = {
	/** 记录当前range信息 */
	cmdRecordRange(): void
}

export class BeforeinputNotifyHandler extends NotifyHandler {
	handle<T extends BeforeinputManager, K extends keyof BeforeinputNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<BeforeinputNotifyEvents[K]>
	): ReturnType<BeforeinputNotifyEvents[K]> {
		if (s !== this._paper.beforeinputManager) {
			return super.handle(s, event, ...args) as any
		}

		if (event === 'cmdRecordRange') {
			return this._paper.cmdBoardManager.recordRangeOption() as any
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: never = event

		throw new Error('No handler')
	}
}
