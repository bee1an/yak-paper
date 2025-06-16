import type { InputManager } from '../event-manager'
import { NotifyHandler } from './notify-handler'

export type InputNotifyEvents = {
	/** 跟新命令面板 */
	cmdUpdate(event: InputEvent): void
}

export class InputNotifyHandler extends NotifyHandler {
	handle<T extends InputManager, K extends keyof InputNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<InputNotifyEvents[K]>
	): ReturnType<InputNotifyEvents[K]> {
		if (s !== this._paper.inputManager) {
			return super.handle(s, event, ...args) as any
		}

		if (event === 'cmdUpdate') {
			return this._paper.cmdBoardManager.handle() as any
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: never = event

		throw new Error('No handler')
	}
}
