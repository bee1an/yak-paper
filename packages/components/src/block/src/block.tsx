import { TextHyper } from '@yak-paper/material'
import { defineComponent } from 'vue'
import { editableWhenInput, editableWhenKeydown } from '@yak-paper/core'

export default defineComponent({
	name: 'PBlock',

	setup() {
		const text = new TextHyper({
			type: 'text'
		})

		text.mergeProps({ onInput: editableWhenInput, onKeydown: editableWhenKeydown })

		return { text }
	},

	render() {
		const { text } = this
		return <>{text.createVNode()}</>
	}
})
