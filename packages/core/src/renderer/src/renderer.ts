import { h, type VNode } from 'vue'
import type { RenderAgreer } from './data-agreer'
import type { MaybeArray } from '@yak-paper/utils'

function render(option: RenderAgreer['children']): MaybeArray<VNode | string | undefined> {
	if (!option) {
		return undefined
	}

	if (Array.isArray(option)) {
		return option.map((item) => {
			if (!item) {
				return undefined
			}

			if (typeof item === 'string') {
				return item
			}

			return h(item.tagName, item.attr, render(item.children))
		})
	}

	if (typeof option === 'string') {
		return option
	}

	return h(option.tagName, option.attr, render(option.children))
}

export const renderer = (option: RenderAgreer) => {
	return h(option.tagName, option.attr, render(option.children))
}
