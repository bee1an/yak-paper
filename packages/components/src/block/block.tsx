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

		if (blockProxy.typeEqualTo('text')) {
			block = new TextBlock({ id: props.id, ...blockProxy.blockOption })
		} else if (blockProxy.typeEqualTo('list')) {
			block = new ListBlock({ id: props.id, ...blockProxy.blockOption })
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
