import type { GetAssignPropItem } from '@yak-paper/utils'
import {
	CompositionManager,
	InputManager,
	KeydownManager,
	type KeydownMediatorEvents
} from '../event-manager'
import { SelectionManager } from '../selection-manager'

type NotifyEvents = [
	{
		target: InputManager
		events: {
			findEditableElement: () => ReturnType<SelectionManager['findEditableElement']>
		}
	},
	{
		target: KeydownManager
		events: KeydownMediatorEvents
	}
]

type Sender = NotifyEvents[number]['target']

type GetEventsProp<T extends Sender> = GetAssignPropItem<NotifyEvents, T, 'target'>['events']

export interface PaperMediator {
	notify<T extends Sender, K extends keyof GetEventsProp<T>>(
		s: T,
		event: K,
		...args: Parameters<
			GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => unknown
		>
	): ReturnType<
		GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => never
	>
}

export abstract class Colleague {
	protected _mediator!: PaperMediator

	constructor(_mediator?: PaperMediator) {
		_mediator && this.setMediator(_mediator)
	}

	setMediator(mediator: PaperMediator) {
		this._mediator = mediator
	}
}

export class Paper implements PaperMediator {
	/**
	 * @description 编辑元素输入事件管理器
	 */
	inputManager: InputManager
	/**
	 * @description 编辑元素按键事件管理器
	 */
	keydownManager: KeydownManager
	/**
	 * @description 选区管理器
	 */
	selectionManager: SelectionManager
	/**
	 * @description 组合输入管理器
	 */
	compositionManager: CompositionManager

	private _handler: NotifyHandler

	constructor() {
		this.inputManager = new InputManager(this)
		this.inputManager.setMediator(this)

		this.keydownManager = new KeydownManager(this)
		this.keydownManager.setMediator(this)

		this.selectionManager = new SelectionManager()
		this.compositionManager = new CompositionManager(this)

		this._handler = new InputManagerNotifyHandler(this)
		this._handler.setNext(new KeydownManagerNotifyHandler(this))
	}

	notify<T extends Sender, K extends keyof GetEventsProp<T>>(
		s: T,
		event: K,
		...args: Parameters<
			GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => unknown
		>
	): ReturnType<
		GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => never
	> {
		return this._handler.handle(s, event, ...args)
	}
}

abstract class NotifyHandler {
	protected _next: NotifyHandler | null = null

	constructor(protected _paper: Paper) {}

	setNext(handler: NotifyHandler) {
		this._next = handler
		return handler
	}

	handle<T extends Sender, K extends keyof GetEventsProp<T>>(
		s: T,
		event: K,
		...args: Parameters<
			GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => unknown
		>
	): ReturnType<
		GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => never
	> {
		if (this._next) {
			return this._next.handle(s, event, ...args)
		}

		throw new Error('No handler')
	}
}

class InputManagerNotifyHandler extends NotifyHandler {
	handle<T extends Sender, K extends keyof GetEventsProp<T>>(
		s: T,
		event: K,
		...args: Parameters<
			GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => unknown
		>
	): ReturnType<
		GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => never
	> {
		if (s === this._paper.inputManager) {
			if (event === 'findEditableElement') {
				return this._paper.selectionManager.findEditableElement() as any
			}
		}
		return super.handle(s, event, ...args)
	}
}

class KeydownManagerNotifyHandler extends NotifyHandler {
	handle<T extends Sender, K extends keyof GetEventsProp<T>>(
		s: T,
		event: K,
		...args: Parameters<
			GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => unknown
		>
	): ReturnType<
		GetEventsProp<T>[K] extends (...args: any[]) => any ? GetEventsProp<T>[K] : () => never
	> {
		if (s !== this._paper.keydownManager) {
			return super.handle(s, event, ...args)
		}
		if (event === 'getRange') {
			return this._paper.selectionManager.getRange() as any
		}
		if (event === 'getInputCompositionState') {
			return this._paper.compositionManager.inputting as any
		}

		throw new Error('Invalid event')
	}
}
