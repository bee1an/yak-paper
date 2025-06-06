import type { GetAssignPropItem } from '@yak-paper/utils'
import { InputManager, KeydownManager } from '../event-manager'
import { SelectionManager } from '../selection-manager'

type NotifyEvents = [
	{
		target: InputManager
		events: {
			findEditableElement: () => ReturnType<SelectionManager['findEditableElement']>
		}
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
	constructor(protected _mediator: PaperMediator) {}
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

	constructor() {
		this.inputManager = new InputManager(this)
		this.keydownManager = new KeydownManager(this)
		this.selectionManager = new SelectionManager()
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
		if (this._isInput(s)) {
			if (event === 'findEditableElement') {
				return this.selectionManager.findEditableElement() as any
			}
		}

		throw new Error('Notify: ' + s + '.' + (event as string) + ' is not supported')
	}

	private _isInput(s: Sender): s is InputManager {
		return s === this.inputManager
	}
}
