import type { MaybeArray } from '@yak-paper/utils'
import type { FormatVal } from '@yak-paper/core'
import type { HProps } from '@yak-paper/types'

export type WrapperAinProps = {
	'data-block-type': string
}

/**
 * @description props 类型
 *
 * 获取vue h 函数的参数类型
 */
export type WrapperPropsType = HProps & WrapperAinProps

/** @description 子元素类型 */
export type ChildrenOption = MaybeArray<FormatVal>

export interface BlockFields {
	/**
	 * @description 唯一标识
	 */
	id: string

	/**
	 * @description 物料类型
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
	children: ChildrenOption
}
