import { json2vnode, type BlockAgreer, type BlockEvents, type NodeRaw } from '@yak-paper/core'
import { createId, EventEmitter } from '@yak-paper/utils'
import { type VNode, type MaybeRef, toValue, useTemplateRef, reactive } from 'vue'
import { useThemeStyle } from '@yak-paper/composables'
import themeDefined from './style/theme'
import themeManager from '../../style'
import { BaseEditable } from '../_internal/baseEditable/baseEditable'
import style from './style/list.module.scss'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

export interface ListBlockAgreer extends BlockAgreer {
	type: 'list'
}

export interface ListBlockOption {
	id?: string

	format?: NodeRaw[]
}

export type ListBlockEvents = {} & BlockEvents

export class ListBlock implements ListBlockAgreer {
	readonly id: string

	readonly type = 'list'

	readonly renderType = 'li'

	readonly props = {
		class: style.block,
		contenteditable: true,
		'data-block-type': this.type,
		'data-block-id': '',
		style: themeStyle,
		ref: 'listRef',
		onClick: () => {
			this.bus.emit('click')
			this._editable.mergeProps({ 'data-placeholder': '项目' })
		}
	}

	children: BlockAgreer['children']

	bus = new EventEmitter<ListBlockEvents>()

	get isEmpty() {
		return this._editable.isEmpty
	}

	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	private _editable!: BaseEditable

	constructor(params?: ListBlockOption) {
		this.id = params?.id ?? createId()
		this.props['data-block-id'] = this.id

		this.children = this._createChildren(params)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as ListBlock
	}

	private _createChildren(params?: ListBlockOption) {
		this._editable = new BaseEditable({
			...params,
			props: {
				class: [style['flex_1']]
			}
		})

		return [
			{
				renderType: 'div',
				props: { class: style.dot, contenteditable: false },
				children: [{ renderType: 'span' }]
			},
			this._editable
		]
	}

	createVNode(): VNode {
		return json2vnode(this)
	}

	focus() {
		this._editable.focus()
		this._editable.mergeProps({ 'data-placeholder': '项目' })
	}

	blur() {
		this._editable.blur()
	}

	toRaw(): ListBlockOption & { type: 'list' } {
		return {
			type: this.type,
			format: this._editable.toRaw().formatRaw
		}
	}
}
