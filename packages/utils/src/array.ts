export const getLastOne = <T>(arr: T[]) => arr[arr.length - 1]

/**
 * 深度获取多维数组中第一项中最底层的数组
 */
export const getArrayHeadDeepestArray = <T extends any[]>(arr: T): any[] => {
	if (Array.isArray(arr[0])) {
		return getArrayHeadDeepestArray(arr[0])
	}

	return arr
}

/**
 * 深度获取多维数组中最后一项中最底层的数组
 */
export const getArrayTailDeepestArray = <T extends any[]>(arr: T): any[] => {
	if (Array.isArray(arr[arr.length - 1])) {
		return getArrayTailDeepestArray(arr[arr.length - 1])
	}

	return arr
}
