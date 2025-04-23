import { TextHyper, type TextDataAgreer } from '@yak-paper/material'
import { defineComponent, inject, type PropType } from 'vue'
import { type DataAgreer } from '@yak-paper/core'
import { pageInjectKey } from '../../page/src/page'

const pBlockProps = {
	blockData: {
		type: Object as PropType<DataAgreer>,
		default: () => []
	}
}

export default defineComponent({
	name: 'PBlock',
	props: pBlockProps,
	setup(props) {
		const { paper } = inject(pageInjectKey)!

		let hyper

		if (props.blockData.type === 'text') {
			hyper = new TextHyper(props.blockData as TextDataAgreer)
		} else {
			throw new Error('block type is not supported')
		}

		hyper.mergeProps({
			onInput: paper.editableInputManager.handle,
			onKeydown: paper.editableKeydownManager.handle
		})

		return { hyper }
	},

	render() {
		const { hyper } = this
		return <>{hyper.createVNode()}</>
	}
})
