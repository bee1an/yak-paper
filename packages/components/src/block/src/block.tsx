import { TextBlock, type TextDataAgreer } from '@yak-paper/material'
import { defineComponent, onUnmounted, type PropType } from 'vue'
import { type DataAgreer } from '@yak-paper/core'
import { BlockWarehouse } from './warehouse'

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
		let block

		if (props.blockData.type === 'text') {
			block = new TextBlock(props.blockData as TextDataAgreer)
		} else {
			throw new Error('block type is not supported')
		}

		BlockWarehouse.instance.addBlock(block)
		onUnmounted(() => BlockWarehouse.instance.removeBlock(block))

		return { block }
	},

	render() {
		const { block } = this
		return <>{block.createVNode()}</>
	}
})
