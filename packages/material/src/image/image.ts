import { useThemeStyle } from '@yak-paper/composables'
import { json2vnode, type BlockAgreer, type BlockEvents } from '@yak-paper/core'
import { reactive, toValue, useTemplateRef, type MaybeRef, type VNode } from 'vue'
import themeDefined from './style/theme'
import themeManager from '../../style'
import style from './style/image.module.scss'
import { createId, EventEmitter } from '@yak-paper/utils'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

export interface ImageBlockAgreer extends BlockAgreer {
	type: 'image'
}

export interface ImageBlockOption {
	id?: string
	src: string
}

export type ImageBlockEvents = {} & BlockEvents

export class ImageBlock implements ImageBlockAgreer {
	readonly id: string

	readonly type = 'image'

	readonly renderType = 'div'

	readonly props = {
		class: style.block,
		contenteditable: false,
		'data-block-type': this.type,
		'data-block-id': '',
		style: themeStyle,
		ref: 'imageRef',
		onClick: () => {
			this.bus.emit('click')
		}
	}

	children: BlockAgreer['children']

	bus = new EventEmitter<ImageBlockEvents>()

	get isEmpty() {
		return false
	}

	private _templateRef: MaybeRef<HTMLElement | null> = null
	get templateRef() {
		return toValue(this._templateRef)
	}

	src: string

	constructor(params?: ImageBlockOption) {
		this.id = params?.id ?? createId()
		this.props['data-block-id'] = this.id

		this.src = params?.src || ''

		this.children = this._createChildren(params)

		this._templateRef = useTemplateRef<HTMLElement>(this.props.ref)
	}

	private _createChildren(params?: ImageBlockOption) {
		return [{ renderType: 'img', props: { src: params?.src ?? this.src } }]
	}

	createVNode(): VNode {
		return json2vnode(this)
	}

	toRaw(): ImageBlockOption & { type: 'image' } {
		return {
			type: this.type,
			src: this.src
		}
	}
}
