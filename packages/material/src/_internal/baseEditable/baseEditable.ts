import { Formater, type NodeOption, type NodeRaw, SelectionManager } from '@yak-paper/core'
import { mergeProps, reactive, toValue, useTemplateRef, type MaybeRef } from 'vue'
import style from './baseEditable.module.scss'
import type { HProps, MaybeArray } from '@yak-paper/utils'

interface BaseEditableOptions {
	format?: NodeRaw[]
	props?: HProps
}

export class BaseEditable {
	tagName = 'div'
	props = {
		class: style.editable,
		contenteditable: true,
		'data-placeholder': '\u200b',
		ref: 'editableRef'
	}

	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	children: MaybeArray<NodeOption>

	get isEmpty() {
		if (!this.templateRef) return true

		const { formatRaw } = Formater.editable2raw(this.templateRef)

		return !formatRaw.length
	}

	constructor(params?: BaseEditableOptions) {
		this.children = this._createChildren(params)
		this.mergeProps(params?.props)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as BaseEditable
	}

	private _createChildren(params?: BaseEditableOptions) {
		if (!params?.format) {
			return []
		}

		return params.format?.map(Formater.raw2option).filter((item) => item !== null) ?? null
	}

	mergeProps(props: HProps | this['props']) {
		this.props = mergeProps(this.props, props || {}) as any
	}

	focus() {
		if (!this.templateRef) return

		const selection = SelectionManager.getSelection()

		if (!selection) return

		const range = SelectionManager.createRange()

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
		this.mergeProps({ 'data-placeholder': '\u200B' })
	}

	toRaw() {
		return Formater.editable2raw(this.templateRef!)
	}
}
