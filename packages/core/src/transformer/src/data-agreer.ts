import type { MaybeArray } from '@yak-paper/utils'
import type { h, VNode } from 'vue'
import type { SelectionManager } from '../../selection-manager'

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

type WrapperAinProps = {
	'data-block-type': string
}

/**
 * @description props 类型
 *
 * 获取vue h 函数的参数类型
 */
export type WrapperPropsType = Parameters<typeof h>[1] & WrapperAinProps

/** @description 单个子元素对象类型 */
export type ChildObjOption = Pick<BlockAgreer, 'tagName' | 'children'> &
	Omit<BlockAgreer['props'], keyof WrapperAinProps>

/** @description 单个子元素类型 */
export type ChildOption = ChildObjOption | string | null

/** @description 子元素类型 */
export type ChildrenOption = MaybeArray<ChildOption>

/**
 * @description 渲染协议, 所有物料的渲染都需要实现这个协议
 */
export abstract class BlockAgreer {
	/**
	 * @description 渲染类型, 同数据类型
	 */
	abstract type: string

	/**
	 * @description 标签名
	 */
	abstract tagName: string

	/**
	 * @description 属性
	 */
	abstract props: WrapperPropsType

	/**
	 * @description 子节点
	 */
	abstract children?: ChildrenOption

	abstract focus?(selection: SelectionManager): void

	// /**
	//  * @description 合并属性
	//  */
	// mergeProps(props: WrapperPropsType): void

	/**
	 * @description 渲染函数
	 * 返回vnode
	 */
	abstract createVNode(): VNode

	/**
	 * @description 序列化
	 * 返回数据协议
	 */
	abstract serialize(): DataAgreer
}
