import { useThemeStyle } from '@yak-paper/composables'
import {
	type RawFormate,
	SelectionManager,
	type BlockAgreer,
	transformer,
	Paper,
	type BlockEvents
} from '@yak-paper/core'
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

	formate?: RawFormate[]
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
			this.focus(Paper.instance.selectionManager)
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
		return transformer.json2Vnode(this)
	}

	focus(selectionManager: SelectionManager) {
		this._editable.focus(selectionManager)
		this._editable.mergeProps({ 'data-placeholder': '可以输入了' })
	}

	blur() {
		this._editable.blur()
	}
}

// serialize(): RawFormate | null {
// 	const dom = this.templateRef

// 	if (!dom) {
// 		return null
// 	}

// 	if (dom.dataset.blockType !== this.type) {
// 		throw new Error('dom is not text')
// 	}

// 	return {
// 		type: this.type,
// 		formate: Transformer.instance.serializer(dom).formate
// 	}
// }
