import type { Paper } from './paper'

export abstract class NotifyHandler {
	protected _next: NotifyHandler | null = null

	constructor(protected _paper: Paper) {}

	setNext(handler: NotifyHandler) {
		this._next = handler
		return handler
	}

	handle(s: unknown, event: unknown, ...args: unknown[]): unknown {
		if (this._next) {
			return this._next.handle(s, event, ...args)
		}

		throw new Error('No handler')
	}
}
