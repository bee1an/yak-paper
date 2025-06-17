import type { HProps } from '@yak-paper/utils'

export type FormatType = 'text' | 'blob' | 'underline' | 'italic'

export interface RawFormate {
	type: FormatType

	/**
	 * @description 文本内容
	 */
	content: string
}

export type FormatObj = {
	tagName: string

	children: string
} & { props: HProps }

export type FormatVal = FormatObj | string

class Formater {
	private static _instance: Formater
	static get instance() {
		if (!Formater._instance) {
			Formater._instance = new Formater()
		}

		return Formater._instance
	}

	raw2Format(raw: RawFormate): FormatVal {
		switch (raw.type) {
			// 处理纯文本类型直接返回内容
			case 'text':
				return raw.content

			// 生成带粗体样式的数据块格式
			case 'blob':
				return {
					tagName: 'span',
					props: {
						'data-formate': 'blob',
						style: {
							fontWeight: 'bold'
						}
					},
					children: raw.content
				}

			// 生成带下划线样式的文本格式
			case 'underline':
				return {
					tagName: 'span',
					props: {
						'data-formate': 'underline',
						style: {
							textDecoration: 'underline'
						}
					},
					children: raw.content
				}

			// 生成斜体文本格式
			case 'italic':
				return {
					tagName: 'span',
					props: {
						'data-formate': 'italic',
						style: {
							fontStyle: 'italic'
						}
					},
					children: raw.content
				}

			// 类型安全检查，确保处理了所有可能的类型
			default: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const _typeSecurity: never = raw.type
				throw new Error('Unexpected formate type')
			}
		}
	}

	html2Raw(dom: HTMLElement): { formate: RawFormate[] } {
		const childNodes = [...dom.childNodes]

		const formate = childNodes.map((node) => {
			// 处理文本类型节点
			if (node.nodeType === Node.TEXT_NODE) {
				return {
					type: 'text' as const,
					content: node.textContent ?? ''
				}
			}

			// 处理元素类型节点（需要包含dataset.formate属性的HTML元素）
			if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
				return {
					type: (node as HTMLSpanElement).dataset.formate! as FormatType,
					content: node.textContent ?? ''
				}
			}

			throw new Error('Unexpected node type')
		})

		// 返回包含格式化数据的对象
		return { formate }
	}
}

export const formater = Formater.instance
