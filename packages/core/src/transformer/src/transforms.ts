import { h, type VNode } from 'vue'
import type { ChildObjOption, ChildrenOption } from './data-agreer'

type CreateChildrenReturnType = undefined | string | VNode | CreateChildrenReturnType[]

export type FormateType = 'text' | 'blob' | 'underline' | 'italic'

export interface JsonDeserializerOption {
	type: FormateType

	/**
	 * @description 文本内容
	 */
	content: string
}

export class Transformer {
	private static _instance: Transformer
	static get instance() {
		if (!Transformer._instance) {
			Transformer._instance = new Transformer()
		}

		return Transformer._instance
	}

	private constructor() {}

	/**
	 * @description 渲染子组件或内容
	 *
	 * 此函数旨在处理和渲染提供的子组件或内容选项它可以接受多种形式的输入，
	 * 包括数组、字符串或一个对象，并据此生成相应的VNode或字符串输出
	 *
	 * @param option 子组件或内容选项，可以是数组、字符串或一个对象
	 * @returns 可能是VNode、字符串或undefined的数组，具体取决于输入类型如果输入为空，则返回undefined
	 */
	private _createChildren(option?: ChildrenOption): CreateChildrenReturnType {
		if (!option) {
			return undefined
		}

		if (typeof option === 'string') {
			return option
		}

		if (Array.isArray(option)) {
			return option.map((item) => this._createChildren(item))
		}

		return this.createVNode(option)
	}

	/**
	 * @description 渲染函数
	 *
	 * 此函数负责根据提供的配置选项渲染指定的元素，
	 * 借用vue的h函数，将配置选项转换为虚拟DOM元素
	 * 其中option参数包含了需要渲染的HTML元素的标签名、属性和子元素
	 *
	 * @param option - 包含渲染所需信息的对象，包括标签名、属性和子元素
	 * @returns 返回渲染后的虚拟DOM元素
	 */
	createVNode(option: ChildObjOption) {
		return h(option.tagName, option.props, this._createChildren(option.children))
	}

	/**
	 * @description 序列化可编辑DOM元素的结构和内容
	 *
	 * @param dom - 需要序列化的HTML元素节点，应当包含需要处理的子节点结构
	 * @returns 返回格式化后的对象，包含一个formate数组，数组中每个元素对应一个子节点的类型和内容
	 *          文本节点类型为'text'，元素节点类型取自dataset.formate属性
	 */
	serializer(dom: HTMLElement) {
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
	deserializer(raw: JsonDeserializerOption) {
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
}
