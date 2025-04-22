import { TextHyper, type TextDataAgreer } from '@yak-paper/material'
import { defineComponent, type PropType } from 'vue'
import { EditableWhenInput, EditableWhenKeydown, type DataAgreer } from '@yak-paper/core'

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
		let hyper

		if (props.blockData.type === 'text') {
			hyper = new TextHyper(props.blockData as TextDataAgreer)
		} else {
			throw new Error('block type is not supported')
		}

		hyper.mergeProps({
			onInput: EditableWhenInput.instance.handle,
			onKeydown: EditableWhenKeydown.instance.handle
		})

		return { hyper }
	},

	render() {
		const { hyper } = this
		return <>{hyper.createVNode()}</>
	}
})
