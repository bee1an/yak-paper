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
