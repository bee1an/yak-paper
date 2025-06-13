import {
	Paper,
	SelectionManager,
	transformer,
	type BlockAgreer,
	type BlockEvents,
	type RawFormate
} from '@yak-paper/core'
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

	formate: RawFormate[]
}

export type ListBlockEvents = {} & BlockEvents

export class ListBlock implements ListBlockAgreer {
	readonly id: string

	readonly type = 'list'

	readonly tagName = 'li'

	readonly props = {
		class: style.block,
		contenteditable: true,
		'data-block-type': this.type,
		'data-block-id': '',
		style: themeStyle,
		ref: 'listRef',
		onClick: () => {
			this.bus.emit('click')
			this.focus(Paper.instance.selectionManager)
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
				tagName: 'div',
				props: { class: style.dot, contenteditable: false },
				children: [{ tagName: 'span' }]
			},
			this._editable
		]
	}

	createVNode(): VNode {
		return transformer.json2Vnode(this)
	}

	focus(selectionManager: SelectionManager) {
		this._editable.focus(selectionManager)
		this._editable.mergeProps({ 'data-placeholder': '项目' })
	}

	blur() {
		this._editable.blur()
	}
}
