import type { VNode } from 'vue'

export interface BlockMethods {
	/**
	 * 渲染函数
	 * 返回vnode
	 */
	createVNode(): VNode

	/**
	 * 返回原始数据
	 */
	toRaw(): any
}
