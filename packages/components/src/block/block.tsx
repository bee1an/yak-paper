import { defineComponent } from 'vue'
import { store } from '../../store'
import { ListBlock, TextBlock } from '@yak-paper/material'

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
			block = new TextBlock({ id: props.id })
		} else if (blockProxy.type === 'list') {
			block = new ListBlock({ id: props.id })
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
