import { useThemeStyle } from '@yak-paper/composables'
import { json2vnode, type BlockAgreer, type BlockEvents, type RawFormat } from '@yak-paper/core'
import themeDefined from './style/theme'
import themeManager from '../../style'
import { reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import { BaseEditable } from '../_internal/baseEditable/baseEditable'
import { createId, EventEmitter } from '@yak-paper/utils'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

export interface TextBlockAgreer extends BlockAgreer {
	type: 'text'
}

export interface TextBlockOption {
	id?: string

	format?: RawFormat[]
}

export type TextBlockEvents = {
	click: []
} & BlockEvents

export class TextBlock implements TextBlockAgreer {
	readonly id!: string

	readonly type = 'text'

	readonly tagName = 'section'

	readonly props = {
		'data-block-type': this.type,
		'data-block-id': '1',
		style: themeStyle,
		ref: 'textRef',
		onClick: () => {
			this.bus.emit('click')
			this._editable.mergeProps({ 'data-placeholder': '可以输入了' })
		}
	}

	children: BlockAgreer['children']

	bus = new EventEmitter<TextBlockEvents>()

	get isEmpty() {
		return this._editable.isEmpty
	}

	/** @description 保存这个组件的dom引用 */
	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	private _editable!: BaseEditable

	constructor(params?: TextBlockOption) {
		this.id = params?.id ?? createId()

		this.props['data-block-id'] = this.id

		this.children = this._createChildren(params)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as TextBlock
	}

	private _createChildren(params?: TextBlockOption) {
		this._editable = new BaseEditable(params)

		return [this._editable]
	}

	createVNode() {
		return json2vnode(this)
	}

	focus() {
		this._editable.focus()
		this._editable.mergeProps({ 'data-placeholder': '可以输入了' })
	}

	blur() {
		this._editable.blur()
	}

	toRaw(): TextBlockOption & { type: 'text' } {
		return {
			type: this.type,
			format: this._editable.toRaw().format
		}
	}
}

// serialize(): RawFormat | null {
// 	const dom = this.templateRef

// 	if (!dom) {
// 		return null
// 	}

// 	if (dom.dataset.blockType !== this.type) {
// 		throw new Error('dom is not text')
// 	}

// 	return {
// 		type: this.type,
// 		format: Transformer.instance.serializer(dom).format
// 	}
// }
