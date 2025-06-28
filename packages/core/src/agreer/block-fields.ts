import type { EventEmitter, HProps, HType, MaybeArray } from '@yak-paper/utils'
import type { SlotChildren } from './slot-children'

export type WrapperAinProps = {
	'data-block-type': string
	'data-block-id': string
}

/**
 * props 类型
 *
 * 获取vue h 函数的参数类型
 */
export type WrapperPropsType = HProps & WrapperAinProps

/** 子元素类型 */
export type ChildOption = {
	renderType: string | HType
	props?: HProps
	children?: MaybeArray<string | ChildOption | SlotChildren>
}

export type BlockEvents = {
	click: []
}

export interface BlockFields {
	/** 唯一标识 */
	id: string

	/** 物料类型 */
	type: string

	/** 标签名或者组件 */
	renderType: string | HType

	/** 属性 */
	props: WrapperPropsType

	/** 子节点 */
	children: ChildOption[] | SlotChildren

	/** 内容是否是空的 */
	isEmpty: boolean

	/** 事件总线 */
	bus: EventEmitter<BlockEvents>
}
