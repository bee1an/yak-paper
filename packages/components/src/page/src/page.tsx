import { defineComponent } from 'vue'
import { PBlock } from '../../block'
import { Paper } from '@yak-paper/core'
import { WareHouse } from './warehouse'

export default defineComponent({
	name: 'PPage',
	setup() {
		Paper.EditableWhenKeydown.eventBus.on('enter', () => {
			WareHouse.instance.addHyper({ type: 'text' })
		})
	},
	render() {
		return (
			<div>
				{WareHouse.instance.hypers.map((item, index) => (
					<PBlock key={index} blockData={item} />
				))}
			</div>
		)
	}
})
