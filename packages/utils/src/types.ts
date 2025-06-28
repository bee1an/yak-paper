import type { h } from 'vue'

/**
 * 返回string类型并且不丢失ts提示
 * @example
 * const includeString: IncludeString<'a' | 'b'> = 'c' // 不报错
 * 对 includeString 赋值时，ts会提示 'a' | 'b'
 */
export type IncludeString<T extends string> = T | (string & {})

/**
 * 将对象的键替换为string类型并且不丢失ts提示
 *
 * @example
 * const includeString: KeyIncludeString<'a' | 'b'> = { a: 1, b: 2, c: 3 } // 不报错
 * 对 includeString[key] 赋值时，ts会提示 'a' | 'b'
 */
export type KeyIncludeString<T extends string> = Record<T | (string & {}), any>

/**
 * @description 可能是一个数组
 */
export type MaybeArray<T> = T | T[]

/**
 * 任意函数
 *
 * 第一泛型参数可以指定函数的参数类型
 * 第二泛型参数可以指定函数的返回值类型
 */
export type AnyFn<T extends any[] = any[], R = any> = (...args: T) => R

export type GetAssignPropItem<T extends any[], K, Prop> = T extends [
	infer F extends T[number],
	...infer Tail extends any[]
]
	? K extends F[Prop extends keyof F ? Prop : never]
		? F
		: GetAssignPropItem<Tail, K, Prop>
	: never

/**
 * h函数的第一个参数
 */
export type HType = Parameters<typeof h>[0]

/**
 * h函数的第二个参数
 */
export type HProps = Parameters<typeof h>[1]

/**
 * 解构数组
 *
 * 支持多维
 * number[][] => number
 */

export type DestructureArray<U> = U extends any[]
	? U extends (infer U)[]
		? DestructureArray<U>
		: never
	: U

/**
 * 嵌套数组
 */
export type NestedArray<T> = T | NestedArray<T>[]
