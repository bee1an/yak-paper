import { h, type VNode } from 'vue'
import type { ChildOption } from '../agreer'

type CreateChildrenReturnType = undefined | string | VNode | CreateChildrenReturnType[]

function createChildren(option?: ChildOption['children']): CreateChildrenReturnType {
	if (!option) {
		return undefined
	}

	if (typeof option === 'string') {
		return option
	}

	if (Array.isArray(option)) {
		return option.map((item) => createChildren(item))
	}

	return json2vnode(option)
}

export const json2vnode = (option: ChildOption) => {
	return h(option.tagName, option.props, createChildren(option.children))
}
