import { EditableInputManager, EditableKeydownManager } from '../../event-manager'
import { SelectionManager } from '../../selection-manager'

export class Paper {
	/**
	 * @description 编辑元素输入事件管理器
	 */
	editableInputManager: EditableInputManager
	/**
	 * @description 编辑元素按键事件管理器
	 */
	editableKeydownManager: EditableKeydownManager
	/**
	 * @description 选取管理器
	 */
	selectionManager: SelectionManager

	constructor() {
		this.editableInputManager = new EditableInputManager()
		this.editableKeydownManager = new EditableKeydownManager(this)
		this.selectionManager = new SelectionManager()
	}
}
