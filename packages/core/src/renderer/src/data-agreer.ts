import type { MaybeArray } from '@yak-paper/utils'

/**
 * @description 数据协议, 所有物料的数据都需要实现这个协议
 */
export interface DataAgreer {
	/**
	 * @description 物料类型
	 */
	type: string
}

/**
 * @description 渲染协议, 所有物料的渲染都需要实现这个协议
 */
export interface RenderAgreer {
	type: string

	tagName: string

	attr: Record<string, any>

	children?: MaybeArray<Omit<RenderAgreer, 'type'> | string | null>
}
