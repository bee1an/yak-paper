import { defineComponent } from 'vue'
import { store } from '../../../store'
import { TextBlock } from '@yak-paper/material'

const pBlockProps = {
	id: {
		type: String,
		required: true,
		default: ''
	}
}

export default defineComponent({
	name: 'PBlock',
	props: pBlockProps,
	setup(props) {
		let block

		const blockProxy = store.findById(props.id)!

		if (blockProxy.type === 'text') {
			block = new TextBlock()
		} else {
			throw new Error('block type error')
		}

		blockProxy.install(block)

		return { block }
	},

	render() {
		const { block } = this
		return <>{block.createVNode()}</>
	}
})
