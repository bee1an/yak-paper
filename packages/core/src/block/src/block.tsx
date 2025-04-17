import { TextHyper } from '@yak-paper/material'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'PBlock',

	setup() {
		const text = new TextHyper({
			type: 'text',
			formate: [
				{ type: 'text', content: '文本' },
				{ type: 'blob', content: '文本1' },
				{ type: 'text', content: '文本2' },
				{ type: 'italic', content: '文本3' },
				{ type: 'text', content: '文本4' },
				{ type: 'underline', content: '文本5' }
			]
		})

		return { text }
	},

	render() {
		const { text } = this
		return <>{text.createVNode()}</>
	}
})
