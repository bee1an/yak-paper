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

/**
 * 获取子节点
 */
export const getChildrenNode = (el: Node) => {
	if (isText(el)) return [el]

	return [...el.childNodes]
}

/**
 * 根据传递位置返回文本节点
 */
export const getTextNodeBySite = (el: Node, site: 'first' | 'last'): Node | null => {
	if (isText(el)) return el

	if (el.childNodes.length === 0) return null

	return getTextNodeBySite(el.childNodes[site === 'first' ? 0 : el.childNodes.length - 1], site)
}

export const isEditable = (element: HTMLElement) => {
	return element.contentEditable === 'true'
}
