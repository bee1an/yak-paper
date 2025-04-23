import { defineComponent, provide, type InjectionKey } from 'vue'
import { PBlock } from '../../block'
import { Paper } from '@yak-paper/core'
import { Warehouse } from './warehouse'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = new Paper()

		paper.editableKeydownManager.on('newLine', () => {
			Warehouse.instance.addBlock({ type: 'text' })
		})

		provide(pageInjectKey, { paper })
	},
	render() {
		return (
			<div>
				{Warehouse.instance.blocks.map((item, index) => (
					<PBlock key={index} blockData={item} />
				))}
			</div>
		)
	}
})
