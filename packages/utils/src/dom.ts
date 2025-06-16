/**
 * @description 返回一个节点是否是文本节点
 *
 * @param el 节点
 */

export const isText = (el: Node) => el.nodeType === Node.TEXT_NODE

/**
 * @description 当节点是文字时返回它的包裹节点
 *
 * @param el 节点
 */
export const textWrapper = (el: Node) => {
	if (!isText(el)) return el

	return el.parentElement
}
