import { InputManager, KeydownManager } from '../event-manager'
import { SelectionManager } from '../selection-manager'

export class Paper {
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
}
