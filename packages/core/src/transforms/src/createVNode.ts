import { h, type VNode } from 'vue'
import type { HyperAgreer } from './data-agreer'
import type { MaybeArray } from '@yak-paper/utils'

type RendererOption = Pick<HyperAgreer, 'tagName' | 'props' | 'children'>

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
export const createVNode = (option: RendererOption) => {
	return h(option.tagName, option.props, createChildren(option.children))
}

/**
 * @description 渲染子组件或内容
 *
 * 此函数旨在处理和渲染提供的子组件或内容选项它可以接受多种形式的输入，
 * 包括数组、字符串或一个对象，并据此生成相应的VNode或字符串输出
 *
 * @param option 子组件或内容选项，可以是数组、字符串或一个对象
 * @returns 可能是VNode、字符串或undefined的数组，具体取决于输入类型如果输入为空，则返回undefined
 */

function createChildren(option: HyperAgreer['children']): MaybeArray<VNode | string | undefined> {
	if (!option) {
		return undefined
	}

	if (typeof option === 'string') {
		return option
	}

	if (Array.isArray(option)) {
		return option.map((item) => {
			if (!item) {
				return undefined
			}

			if (typeof item === 'string') {
				return item
			}

			return createVNode(item)
		})
	}

	return createVNode(option)
}
