import { onInput } from '@yak-paper/composables'
import { TextHyper } from '@yak-paper/material'
import { defineComponent } from 'vue'
import { editableWhenKeydown } from '../../event-coordinator/src/editable-keydown-handler'

export default defineComponent({
	name: 'PBlock',

	setup() {
		const text = new TextHyper({
			type: 'text'
		})

		text.mergeProps({ onInput, onKeydown: editableWhenKeydown })

		return { text }
	},

	render() {
		const { text } = this
		return <>{text.createVNode()}</>
	}
})
