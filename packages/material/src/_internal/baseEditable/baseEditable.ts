import { formater, type FormatVal } from '@yak-paper/core'
import { reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import type { HProps, MaybeArray, RawFormate, SelectionManager } from 'yak-paper'
import style from './baseEditable.module.scss'

interface BaseEditableOptions {
	formate?: RawFormate[]
	props?: HProps
}

export class BaseEditable {
	readonly type = 'editable'

	readonly tagName = 'div'

	readonly props = {
		class: style.editable,
		contenteditable: true,
		'data-placeholder': '',
		ref: 'editableRef'
	}

	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	children: MaybeArray<FormatVal> = []

	constructor(params?: BaseEditableOptions) {
		this.children = this._createChildren(params)
		this.modifyProps(params?.props)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as BaseEditable
	}

	private _createChildren(params?: BaseEditableOptions) {
		if (!params?.formate) {
			return []
		}

		return params.formate?.map(formater.raw2Format).filter((item) => item !== null) ?? null
	}

	modifyProps(props: HProps | this['props']) {
		Object.assign(this.props, props)
	}

	focus(selectionManager: SelectionManager) {
		if (!this.templateRef) return

		const selection = selectionManager.getSelection()

		if (!selection) return

		const range = selectionManager.createRange()

		if (this.templateRef.childNodes.length) {
			range.setStartAfter(this.templateRef.childNodes[0])
			range.setEndAfter(this.templateRef.childNodes[this.templateRef.childNodes.length - 1])
		} else {
			range.selectNodeContents(this.templateRef)
		}

		selection.removeAllRanges()
		selection.addRange(range)
		selection.collapseToEnd()
	}

	blur() {
		this.modifyProps({ 'data-placeholder': '\u200B' })
	}
}
