import type { BlockFields } from './blockFields'
import type { BlockMethods } from './blockMethods'

/**
 * @description 数据协议, 所有物料的数据都需要实现这个协议
 */
export interface BlockAgreer extends BlockFields, BlockMethods {}
