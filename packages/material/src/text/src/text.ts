import { useThemeStyle } from '@yak-paper/composables'
import {
	Transformer,
	type DataAgreer,
	type JsonDeserializerOption,
	type BlockAgreer
} from '@yak-paper/core'
import themeDefined from '../style/theme'
import themeManager from '../../../style'
import { reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import style from '../style/text.module.scss'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

export interface TextDataAgreer extends DataAgreer {
	type: 'text'

	formate?: JsonDeserializerOption[]
}

export class TextBlock implements BlockAgreer {
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

	children: BlockAgreer['children'] = []

	/** @description 保存这个组件的dom引用 */
	private _templateRef: MaybeRef<HTMLElement | null>
	get templateRef() {
		return toValue(this._templateRef)
	}

	constructor(private _rawData?: TextDataAgreer) {
		this.children = _rawData ? this.deserialize(_rawData) : []

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as TextBlock
	}

	// /**
	//  * 合并属性到当前组件的props对象
	//  *
	//  * @param props - 需要合并的属性对象，类型为包含任意值的键值对集合（Record<string, any>）。
	//  */
	// mergeProps(props: WrapperPropsType) {
	// 	Object.assign(this.props, props)
	// }

	focus() {}

	/**
	 * @description 创建虚拟节点
	 *
	 * 此函数负责调用renderer函数来生成当前组件的虚拟节点
	 * 相当于基于vue的json2Html
	 *
	 * @returns 返回由renderer函数生成的虚拟节点
	 */
	createVNode() {
		return Transformer.instance.createVNode(this)
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
		const dom = this.templateRef

		if (!dom) {
			return this._rawData ?? { type: this.type }
		}

		if (dom.dataset.blockType !== this.type) {
			throw new Error('dom is not text')
		}

		return {
			type: this.type,
			...Transformer.instance.serializer(dom)
		}
	}

	/**
	 * @description 将原始数据反序列化为目标格式。
	 *
	 * 该函数接收一个 `TextDataAgreer` 类型的原始数据，通过 `Transformer.instance.deserializer` 方法
	 * 对 `raw.formate` 数组中的每个元素进行反序列化，并过滤掉结果为 `null` 的元素。
	 *
	 * @param raw - 包含需要反序列化数据的 `TextDataAgreer` 对象。如果 `raw` 或 `raw.formate` 为 `null` 或 `undefined`，则返回 `undefined`。
	 * @returns 反序列化后的数组，其中不包含 `null` 元素。如果 `raw` 或 `raw.formate` 为 `null` 或 `undefined`，则返回 `undefined`。
	 */
	deserialize(raw: TextDataAgreer) {
		return raw.formate?.map(Transformer.instance.deserializer).filter((item) => item !== null)
	}
}
