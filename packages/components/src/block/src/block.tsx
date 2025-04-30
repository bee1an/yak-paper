import { TextHyper, type TextDataAgreer } from '@yak-paper/material'
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
		let hyper

		if (props.blockData.type === 'text') {
			hyper = new TextHyper(props.blockData as TextDataAgreer)
		} else {
			throw new Error('block type is not supported')
		}

		BlockWarehouse.instance.addHyper(hyper)
		onUnmounted(() => BlockWarehouse.instance.removeHyper(hyper))

		return { hyper }
	},

	render() {
		const { hyper } = this
		return <>{hyper.createVNode()}</>
	}
})
