import { defineComponent, inject } from 'vue'
import { ImageBlock, ListBlock, TextBlock } from '@yak-paper/material'
import { pageInjectKey } from '../page/page'

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
		const { paper } = inject(pageInjectKey)!

		let block

		const blockProxy = paper.sections.findById(props.id)!

		if (blockProxy.typeEqualTo('text')) {
			block = new TextBlock({ ...blockProxy.blockOption })
		} else if (blockProxy.typeEqualTo('list')) {
			block = new ListBlock({ ...blockProxy.blockOption })
		} else if (blockProxy.typeEqualTo('image')) {
			block = new ImageBlock({ ...blockProxy.blockOption })
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
