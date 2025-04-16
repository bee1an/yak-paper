import { TextRender } from '@yak-paper/material'
import { defineComponent } from 'vue'
import { renderer } from '@yak-paper/core'

export default defineComponent({
	name: 'PBlock',

	setup() {
		const text = new TextRender({
			type: 'text',
			formate: [
				{ type: 'text', content: '文本' },
				{ type: 'text', content: '文本1' },
				{ type: 'blob', content: '文本2' }
			]
		})

		return { text }
	},

	render() {
		const { text } = this
		return <>{renderer(text)}</>
	}
})
