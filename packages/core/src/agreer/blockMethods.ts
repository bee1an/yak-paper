import type { VNode } from 'vue'

export interface BlockMethods {
	/**
	 * @description 渲染函数
	 * 返回vnode
	 */
	createVNode(): VNode
}
