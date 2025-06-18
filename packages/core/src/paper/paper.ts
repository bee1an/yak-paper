import {
	BeforeinputManager,
	BlurManager,
	CompositionManager,
	InputManager,
	KeydownManager
} from '../event-manager'
import { SelectionManager } from '../selection-manager'
import type { PaperMediator, PublicNotifyEvent } from './colleague'
import { CmdBoardManager } from '../cmd-board-manager'
import { sections, type Sections } from '../sections'
import { Creator } from '../sections/creator'
import type { NotifyHandler } from './notify-handler'
import { InputNotifyHandler } from './input-notify-handler'
import { KeydownNotifyHandler } from './keydown-notify-handler'
import { BeforeinputNotifyHandler } from './beforeinput-notify-handler'

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
	/**
	 * @description 段落类
	 */
	sections: Sections
	/**
	 * @description 输入前事件
	 */
	beforeinputManager: BeforeinputManager

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

		this.sections = sections
		this.sections.setMediator(this)
		sections.setCreator(Creator.getInstance(this))

		this.beforeinputManager = new BeforeinputManager()
		this.beforeinputManager.setMediator(this)

		this._notifyHandler = new InputNotifyHandler(this)
		this._notifyHandler
			.setNext(new KeydownNotifyHandler(this))
			.setNext(new BeforeinputNotifyHandler(this))
	}
	notify(s: unknown, event: keyof PublicNotifyEvent, ...args: unknown[]) {
		if (typeof s === 'string') {
			args.unshift(event)
			event = s as keyof PublicNotifyEvent
		}

		if (event === 'public:getInputCompositionState') {
			return this.compositionManager.inputting
		}
		if (event === 'public:cmdBoardIsActive') {
			return this.cmdBoardManager.active
		}
		if (event === 'public:setCmdBoardActive') {
			this.cmdBoardManager.active = true
			return
		}
		if (event === 'public:selection:findEditableElement') {
			return this.selectionManager.findEditableElement()
		}
		if (event === 'public:selection:getRange') {
			return this.selectionManager.getRange()
		}
		if (event === 'public:selection:findFocusedBlock') {
			return this.selectionManager.findFocusedBlock()
		}
		if (event === 'public:selection:findFocusedBlockId') {
			return this.selectionManager.findFocusedBlockId()
		}
		if (event === 'public:sections:findById') {
			return this.sections.findById(args[0] as string)
		}
		if (event === 'public:sections.creator:createNewLineByIndex') {
			return this.sections.creator.createNewLineByIndex(...(args as [number, any]))
		}
		if (event === 'public:sections:findIndexById') {
			return this.sections.findIndexById(...(args as [any]))
		}
		if (event === 'public:sections:findByFocused') {
			return this.sections.findByFocused()
		}
		if (event === 'public:sections:deleteByIndex') {
			return this.sections.deleteByIndex(...(args as [number]))
		}
		if (event === 'public:sections:getLength') {
			return this.sections.getLength()
		}
		if (event === 'public:sections:getByIndex') {
			return this.sections.getByIndex(...(args as [number]))
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: never = event

		return this._notifyHandler.handle(s, event, ...args)
	}
}
