/**
 * @description 责任链处理者
 */
interface Hander {
	/**
	 * @description 设置下一个处理者
	 */
	setNext(handler: Hander): Hander

	/**
	 * @description 处理程序
	 */
	handle: (event: KeyboardEvent) => void
}

export class EditableKeydownBaseHandler implements Hander {
	private _nextHandler: Hander | null = null

	setNext(handler: Hander): Hander {
		this._nextHandler = handler
		return handler
	}

	handle(event: KeyboardEvent) {
		if (this._nextHandler) {
			this._nextHandler.handle(event)
		}
	}
}
