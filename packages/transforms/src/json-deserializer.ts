import type { FormateType } from './formate'

export interface JsonDeserializerOption {
	type: FormateType

	/**
	 * @description 文本内容
	 */
	content: string
}

/**
 * @description JSON 反序列化处理器，根据输入类型生成不同格式的反序列化结果
 *
 * @param raw - 反序列化配置选项对象，必须包含 type 和 content 属性
 *   type 支持的取值：
 *   - 'text'   : 直接返回原始文本内容
 *   - 'blob'   : 生成带有粗体样式的 span 元素
 *   - 'underline' : 生成带下划线样式的 span 元素
 *   - 'italic' : 生成斜体样式的 span 元素
 *
 * @returns 根据类型返回：
 *   - 字符串（当 type 为 'text' 时）
 *   - 包含标签定义的对象结构（当 type 为其他格式类型时）
 */
export function jsonDeserializer(raw: JsonDeserializerOption) {
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
			const typeSecurity: never = raw.type
			throw new Error('Unexpected formate type')
		}
	}
}
