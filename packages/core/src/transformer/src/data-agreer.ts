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

/**
 * @description props 类型
 *
 * 获取vue h 函数的参数类型
 */
export type WrapperPropsType = Parameters<typeof h>[1]

/** @description 单个子元素对象类型 */
export type ChildObjOption = Pick<HyperAgreer, 'tagName' | 'props' | 'children'>

/** @description 单个子元素类型 */
export type ChildOption = ChildObjOption | string | null

/** @description 子元素类型 */
export type ChildrenOption = MaybeArray<ChildOption>

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
	props: WrapperPropsType

	/**
	 * @description 子节点
	 */
	children?: ChildrenOption

	// /**
	//  * @description 合并属性
	//  */
	// mergeProps(props: WrapperPropsType): void

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
