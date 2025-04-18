import { defineComponent, useTemplateRef } from 'vue'
import { PBlock } from '../../block'

export default defineComponent({
	name: 'PPage',

	setup() {
		const blockRef = useTemplateRef<InstanceType<typeof PBlock>>('block')

		const btnClick = () => {
			const json = blockRef.value?.text.serialize()
			console.log('json', json)
		}

		return {
			btnClick
		}
	},

	render() {
		const { btnClick } = this

		return (
			<div>
				<button onClick={btnClick}>点击</button>
				<PBlock ref="block" />
			</div>
		)
	}
})
