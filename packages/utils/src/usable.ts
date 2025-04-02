/**
 * @description 返回状态类名
 * @param name 状态名
 * @param state 状态值
 */
export const usable = (name: string, state?: boolean, prefix = 'is-') => {
	return state ? `${prefix}${name}` : ''
}
