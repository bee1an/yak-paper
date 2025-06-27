import type { DestructureArray } from './types'

/**
 * 深度获取多维数组中第一项中最底层的数组
 */
export const getArrayHeadDeepestArray = <T>(arr: T[]): DestructureArray<T>[] => {
	if (Array.isArray(arr[0])) {
		return getArrayHeadDeepestArray(arr[0])
	}

	return arr as DestructureArray<T>[]
}

/**
 * 深度获取多维数组中最后一项中最底层的数组
 */
export const getArrayTailDeepestArray = <T>(arr: T[]): DestructureArray<T>[] => {
	if (Array.isArray(arr[arr.length - 1])) {
		return getArrayTailDeepestArray(arr[arr.length - 1] as T[])
	}

	return arr as DestructureArray<T>[]
}

/**
 * 可以暂停的循环
 */
export const eachBreakable = <T>(
	arr: T[],
	callback: (item: T, index: number, array: T[]) => boolean | void
) => {
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i]
		const result = callback(item, i, arr)
		if (result) break
	}
}
