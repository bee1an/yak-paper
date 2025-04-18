import type { MaybeArray } from '@yak-paper/utils'
import type { h, VNode } from 'vue'

/**
 * @description 数据协议, 所有物料的数据都需要实现这个协议
 */
export interface DataAgreer {
	/**
	 * @description 唯一标识
	 */

	/**
	 * @description 物料类型
	 */
	type: string
}

export type HPropsType = Parameters<typeof h>[1]

/**
 * @description 渲染协议, 所有物料的渲染都需要实现这个协议
 */
export interface HyperAgreer {
	/**
	 * @description 渲染类型, 同数据类型
	 */
	type: string

	/**
	 * @description 标签名
	 */
	tagName: string

	/**
	 * @description 属性
	 */
	props: HPropsType

	/**
	 * @description 子节点
	 */
	children?: MaybeArray<Pick<HyperAgreer, 'tagName' | 'props' | 'children'> | string | null>

	mergeProps(props: HPropsType): void

	/**
	 * @description 渲染函数
	 * 返回vnode
	 */
	createVNode(): VNode

	/**
	 * @description 序列化
	 * 返回数据协议
	 */
	serialize(): DataAgreer
}
