import { useThemeStyle } from '@yak-paper/composables'
import {
	createVNode,
	editableSerializer,
	jsonDeserializer,
	type DataAgreer,
	type JsonDeserializerOption,
	type HyperAgreer,
	type HPropsType
} from '@yak-paper/transforms'
import themeDefined from '../style/theme'
import themeManager from '../../../style'
import { reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import style from '../style/text.module.scss'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

interface TextDataAgreer extends DataAgreer {
	type: 'text'

	formate?: JsonDeserializerOption[]
}

export class TextHyper implements HyperAgreer {
	readonly type = 'text'

	readonly tagName = 'div'

	readonly props = {
		class: style.block,
		contenteditable: true,
		'data-placeholder': '请输入',
		'data-block-type': this.type,
		style: themeStyle,
		ref: 'textRef'
	}

	children: HyperAgreer['children'] = []

	/** @description 保存这个组件的dom引用 */
	templateRef: MaybeRef<HTMLElement | null>

	constructor(private _rawData?: TextDataAgreer) {
		this.children = _rawData?.formate?.map(jsonDeserializer).filter((item) => item !== null)

		this.templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as TextHyper
	}

	/**
	 * 合并属性到当前组件的props对象
	 *
	 * @param props - 需要合并的属性对象，类型为包含任意值的键值对集合（Record<string, any>）。
	 */
	mergeProps(props: HPropsType) {
		Object.assign(this.props, props)
	}

	/**
	 * @description 创建虚拟节点
	 *
	 * 此函数负责调用renderer函数来生成当前组件的虚拟节点
	 * 相当于基于vue的json2Html
	 *
	 * @returns 返回由renderer函数生成的虚拟节点
	 */
	createVNode() {
		return createVNode(this)
	}

	/**
	 * 将当前对象转换为TextDataAgreer类型的JSON对象
	 * 此方法用于序列化对象的状态，以便于存储或传输
	 * 相当于html2Json
	 *
	 * @returns {TextDataAgreer} 表示当前对象的JSON对象，包含类型信息
	 * @throws {Error} 如果DOM的blockType与当前对象类型不匹配，则抛出错误
	 */
	serialize(): TextDataAgreer {
		const dom = toValue(this.templateRef)

		if (!dom) {
			return this._rawData ?? { type: this.type }
		}

		if (dom.dataset.blockType !== this.type) {
			throw new Error('dom is not text')
		}

		return {
			type: this.type,
			...editableSerializer(dom)
		}
	}
}
