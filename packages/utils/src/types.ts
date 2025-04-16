/**
 * @description 返回string类型并且不丢失ts提示
 * @example
 * const includeString: IncludeString<'a' | 'b'> = 'c' // 不报错
 * 对 includeString 赋值时，ts会提示 'a' | 'b'
 */
export type IncludeString<T extends string> = T | (string & {})

/**
 * @description 将对象的键替换为string类型并且不丢失ts提示
 * @example
 * const includeString: KeyIncludeString<'a' | 'b'> = { a: 1, b: 2, c: 3 } // 不报错
 * 对 includeString[key] 赋值时，ts会提示 'a' | 'b'
 */
export type KeyIncludeString<T extends string> = Record<T | (string & {}), any>

/**
 * @description 可能是一个数组
 */
export type MaybeArray<T> = T | T[]
