import type { VNode } from 'vue'
import type { SelectionManager } from '../selection-manager'

export interface BlockMethods {
	/**
	 * @description 渲染函数
	 * 返回vnode
	 */
	createVNode(): VNode

	focus?(selectionManager: SelectionManager): void

	blur?(): void
}
