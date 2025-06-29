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

/**
 * 是否是文字节点
 */
export const isEditable = (element: Node) => {
	if (element.nodeType !== Node.ELEMENT_NODE) return false

	return (element as HTMLElement).contentEditable === 'true'
}

/**
 * 查找元素可编辑的子元素
 */
export const findChildElementIsEditable = (
	el: HTMLElement,
	option?: { deep?: boolean }
): HTMLElement[] => {
	const children = [...el.children]

	return children.reduce((pre, child) => {
		if (isEditable(child as HTMLElement)) {
			pre.push(child as HTMLElement)
		}

		if (option?.deep) {
			pre.push(...findChildElementIsEditable(child as HTMLElement, option))
		}

		return pre
	}, [] as HTMLElement[])
}

/**
 * 获取最近的可编辑元素
 */
export const getClosestEditableElement = (el: Node) => {
	if (isEditable(el)) return el

	if (el.nodeType === Node.TEXT_NODE) return el.parentElement?.closest('[contenteditable="true"]')

	if (el.nodeType !== Node.ELEMENT_NODE) return null

	return (el as HTMLElement).closest('[contenteditable="true"]')
}
