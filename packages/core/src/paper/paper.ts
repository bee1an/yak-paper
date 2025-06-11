import { BlurManager, CompositionManager, InputManager, KeydownManager } from '../event-manager'
import { SelectionManager } from '../selection-manager'
import type {
	InputManagerNotifyEvents,
	KeydownManagerNotifyEvents,
	PaperMediator,
	PublicNotifyEvent
} from './colleague'
import { CmdBoardManager } from '../cmd-board-manager'

export class Paper implements PaperMediator {
	private static _instance: Paper | null = null
	static get instance() {
		if (!this._instance) {
			this._instance = new Paper()
		}
		return this._instance
	}

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
	/**
	 * @description 编辑元素失焦事件管理器
	 */
	blurManager: BlurManager
	/**
	 * @description 命令面板管理器
	 */
	cmdBoardManager: CmdBoardManager

	private _notifyHandler: NotifyHandler

	private constructor() {
		this.inputManager = new InputManager()
		this.inputManager.setMediator(this)

		this.keydownManager = new KeydownManager()
		this.keydownManager.setMediator(this)

		this.selectionManager = new SelectionManager()
		this.compositionManager = new CompositionManager(this)

		this.blurManager = new BlurManager()
		this.blurManager.setMediator(this)

		this.cmdBoardManager = new CmdBoardManager()
		this.cmdBoardManager.setMediator(this)

		this._notifyHandler = new InputManagerNotifyHandler(this)
		this._notifyHandler.setNext(new KeydownManagerNotifyHandler(this))
	}
	notify(s: unknown, event: keyof PublicNotifyEvent, ...args: unknown[]) {
		if (event === 'public:findEditableElement') {
			return this.selectionManager.findEditableElement()
		}
		if (event === 'public:getRange') {
			return this.selectionManager.getRange()
		}
		if (event === 'public:getInputCompositionState') {
			return this.compositionManager.inputting
		}
		if (event === 'public:getSelectionManager') {
			return this.selectionManager
		}
		if (event === 'public:cmdBoardIsActive') {
			return this.cmdBoardManager.active
		}
		if (event === 'public:setCmdBoardActive') {
			this.cmdBoardManager.active = true
			return
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: never = event

		return this._notifyHandler.handle(s, event, ...args)
	}
}

abstract class NotifyHandler {
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

class InputManagerNotifyHandler extends NotifyHandler {
	handle<T extends InputManager, K extends keyof InputManagerNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<InputManagerNotifyEvents[K]>
	): ReturnType<InputManagerNotifyEvents[K]> {
		if (s !== this._paper.inputManager) {
			return super.handle(s, event, ...args) as any
		}

		if (event === 'cmdUpdate') {
			this._paper.cmdBoardManager.handle()
		} else if (event === 'cmdRecordRange') {
			this._paper.cmdBoardManager.recordRangeOption()
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _: never = event
		}

		return undefined as any
	}
}

class KeydownManagerNotifyHandler extends NotifyHandler {
	handle<T extends KeydownManager, K extends keyof KeydownManagerNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<KeydownManagerNotifyEvents[K]>
	): ReturnType<KeydownManagerNotifyEvents[K]> {
		if (s !== this._paper.keydownManager) {
			return super.handle(s, event, ...args) as any
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: never = event

		throw new Error('No handler')
	}
}
