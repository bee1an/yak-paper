import type { HProps, MaybeArray } from '@yak-paper/utils'

export type WrapperAinProps = {
	'data-block-type': string
	'data-block-id': string
}

/**
 * @description props 类型
 *
 * 获取vue h 函数的参数类型
 */
export type WrapperPropsType = HProps & WrapperAinProps

/** @description 子元素类型 */
export type ChildOption = {
	tagName: string
	props?: HProps
	children?: MaybeArray<string | ChildOption>
}

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
	children: ChildOption[]

	/**
	 * @description 内容是否是空的
	 */
	isEmpty: boolean
}
