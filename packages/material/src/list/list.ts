import { transformer, type BlockAgreer, type RawFormate } from '@yak-paper/core'
import { createId } from '@yak-paper/utils'
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

export interface ListBlockParams {
	id?: string

	formate?: RawFormate[]
}

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
		ref: 'listRef'
	}

	children: BlockAgreer['children']

	/** @description 保存这个组件的dom引用 */
	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	constructor(params?: ListBlockParams) {
		this.id = params?.id ?? createId()
		this.props['data-block-id'] = this.id

		this.children = this._createChildren(params)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)

		return reactive(this) as unknown as ListBlock
	}

	private _createChildren(params?: ListBlockParams) {
		return [
			{
				tagName: 'div',
				props: { class: style.dot, contenteditable: false },
				children: [{ tagName: 'span' }]
			},
			new BaseEditable(params)
		]
	}

	createVNode(): VNode {
		return transformer.json2Vnode(this)
	}
}
