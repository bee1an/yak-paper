import { useThemeStyle } from '@yak-paper/composables'
import { Transformer, type RawFormate, SelectionManager, type BlockAgreer } from '@yak-paper/core'
import themeDefined from './style/theme'
import themeManager from '../../style'
import { reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import { createId } from 'yak-paper'
import { BaseEditable } from '../_internal/baseEditable/baseEditable'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

export interface TextBlockAgreer extends BlockAgreer {
	type: 'text'
}

export interface TextBlockParams {
	id?: string

	formate?: RawFormate[]
}

export class TextBlock implements TextBlockAgreer {
	readonly id: string

	readonly type = 'text'

	readonly tagName = 'section'

	readonly props = {
		'data-block-type': this.type,
		style: themeStyle,
		ref: 'textRef'
	}

	children: BlockAgreer['children']

	/** @description 保存这个组件的dom引用 */
	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	private _editables: BaseEditable[] = []

	constructor(params?: TextBlockParams) {
		this.id = params?.id ?? createId()

		this.children = this._createChildren(params)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as TextBlock
	}

	private _createChildren(params?: TextBlockParams) {
		this._editables.push(new BaseEditable(params))

		return [...this._editables]
	}

	createVNode() {
		return Transformer.instance.json2Vnode(this)
	}

	focus(selectionManager: SelectionManager) {
		this._editables[0].focus(selectionManager)
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
