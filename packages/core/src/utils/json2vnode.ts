import { h, type VNode } from 'vue'
import type { BlockAgreer, ChildOption } from '../agreer'
import { SlotChildren } from '../agreer/slot-children'

type NonSlotChild = undefined | string | VNode

type CreateChildrenReturnType = (NonSlotChild | NonSlotChild[]) | SlotChildren['slot']

function createChildren(option?: ChildOption['children']): CreateChildrenReturnType {
	if (!option) {
		return undefined
	}

	if (typeof option === 'string') {
		return option
	}

	if (Array.isArray(option)) {
		return option.map((item) => createChildren(item)) as NonSlotChild[]
	}

	if (option instanceof SlotChildren) {
		return option.slot
	}

	return json2vnode(option)
}

export const json2vnode = (option: BlockAgreer | ChildOption) => {
	return h(option.renderType, option.props, createChildren(option.children))
}
