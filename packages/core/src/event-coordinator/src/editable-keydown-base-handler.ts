import type { EventEmitter } from '@yak-paper/utils'
import type { EditableKeydownEvents } from './editable-keydown-handler'

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

export abstract class EditableKeydownBaseHandler implements Hander {
	private _nextHandler: Hander | null = null

	constructor(protected _eventBus: EventEmitter<EditableKeydownEvents>) {}

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

/**
 * @description 检查是否仅按下了指定的修饰键
 * 该函数会验证事件对象中是否只有指定的修饰键被按下，其他修饰键未被按下
 *
 * @param event - 键盘事件对象，包含按键状态信息
 * @param key - 需要检查的修饰键，可以是 'ctrlKey'、'shiftKey'、'altKey' 或 'metaKey' 之一
 * @returns 如果仅按下了指定的修饰键且其他修饰键未被按下，则返回 true；否则返回 false
 */
export const isOnlyModifierKeyPressed = (
	event: KeyboardEvent,
	key: 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'
) => {
	const keys = ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'] as const

	return keys.every((k) => (k === key ? event[k] : !event[k]))
}
