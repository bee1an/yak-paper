import { useThemeStyle } from '@yak-paper/composables'
import {
	Transformer,
	type RawFormate,
	SelectionManager,
	type BlockAgreer,
	formater
} from '@yak-paper/core'
import themeDefined from '../style/theme'
import themeManager from '../../../style'
import { reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import style from '../style/text.module.scss'
import { createId } from 'yak-paper'

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
	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	constructor(params?: TextBlockParams) {
		this.id = params?.id ?? createId()

		this.children = this._createChildren(params) ?? []

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as TextBlock
	}

	private _createChildren(params?: TextBlockParams) {
		if (!params?.formate) {
			return null
		}

		return params.formate?.map(formater.raw2Format).filter((item) => item !== null) ?? null
	}

	createVNode() {
		return Transformer.instance.json2Vnode(this)
	}

	focus(selectionManager: SelectionManager) {
		if (!this.templateRef) return
		const range = selectionManager.createRange()

		if (this.templateRef.childNodes.length) {
			range.setStartAfter(this.templateRef.childNodes[0])
			range.setEndAfter(this.templateRef.childNodes[this.templateRef.childNodes.length - 1])
		} else {
			range.selectNodeContents(this.templateRef)
		}

		selectionManager.selection?.removeAllRanges()
		selectionManager.selection?.addRange(range)
		selectionManager.selection?.collapseToEnd()
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
}
