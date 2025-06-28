import type { BlockFields } from './block-fields'
import type { BlockMethods } from './block-methods'

/**
 * @description 数据协议, 所有物料的数据都需要实现这个协议
 */
export interface BlockAgreer extends BlockFields, BlockMethods {}
