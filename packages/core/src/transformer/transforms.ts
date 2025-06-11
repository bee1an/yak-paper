import { h, type VNode } from 'vue'
import type { BlockAgreer, ChildOption } from '@yak-paper/core'
import type { HProps } from '@yak-paper/utils'

type CreateChildrenReturnType = undefined | string | VNode | CreateChildrenReturnType[]

export type FormateType = 'text' | 'blob' | 'underline' | 'italic'

export type Json2VnodeOption = Pick<BlockAgreer, 'tagName' | 'children'> & { props: HProps }

class Transformer {
	private static _instance: Transformer
	static get instance() {
		if (!Transformer._instance) {
			Transformer._instance = new Transformer()
		}

		return Transformer._instance
	}

	private constructor() {}

	private _createChildren(option?: ChildOption['children']): CreateChildrenReturnType {
		if (!option) {
			return undefined
		}

		if (typeof option === 'string') {
			return option
		}

		if (Array.isArray(option)) {
			return option.map((item) => this._createChildren(item))
		}

		return this.json2Vnode(option)
	}

	json2Vnode(option: ChildOption) {
		return h(option.tagName, option.props, this._createChildren(option.children))
	}
}

export const transformer = Transformer.instance
