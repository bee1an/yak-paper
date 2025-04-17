import type { JsonDeserializerOption } from './json-deserializer'

/**
 * @description 序列化可编辑DOM元素的结构和内容
 *
 * @param dom - 需要序列化的HTML元素节点，应当包含需要处理的子节点结构
 * @returns 返回格式化后的对象，包含一个formate数组，数组中每个元素对应一个子节点的类型和内容
 *          文本节点类型为'text'，元素节点类型取自dataset.formate属性
 */
export const editableSerializer = (dom: HTMLElement): { formate: JsonDeserializerOption[] } => {
	const childNodes = [...dom.childNodes]

	const formate = childNodes.map((node) => {
		// 处理文本类型节点
		if (node.nodeType === Node.TEXT_NODE) {
			return {
				type: 'text',
				content: node.textContent ?? ''
			}
		}

		// 处理元素类型节点（需要包含dataset.formate属性的HTML元素）
		if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
			return {
				type: (node as HTMLSpanElement).dataset.formate!,
				content: node.textContent ?? ''
			}
		}

		throw new Error('Unexpected node type')
	})

	// 返回包含格式化数据的对象
	return { formate } as { formate: JsonDeserializerOption[] }
}
