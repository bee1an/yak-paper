import { defineComponent, nextTick, provide, toValue, type InjectionKey } from 'vue'
import { PBlock } from '../../block'
import { Paper } from '@yak-paper/core'
import { PageWarehouse } from './warehouse'
import style from '../style/page.module.scss'
import { BlockWarehouse } from '../../block/src/warehouse'
import { getLastOne } from '@yak-paper/utils'
import type { TextHyper } from 'yak-paper'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = new Paper()

		const addEmptyText = () => {
			PageWarehouse.instance.addBlock({ type: 'text' })
		}

		paper.editableKeydownManager.on('newLine', () => {
			addEmptyText()
		})

		const focusLast = () => {
			if (BlockWarehouse.instance.hypers.length === 0) {
				addEmptyText()
			}

			nextTick(() => {})

			// BlockWarehouse.instance.hypers[BlockWarehouse.instance.hypers.length - 1]
		}

		provide(pageInjectKey, { paper })

		return { focusLast }
	},
	render() {
		const { focusLast } = this

		return (
			<div class={style.page} onClick={focusLast}>
				<div onClick={(event) => event.stopPropagation()}>
					{PageWarehouse.instance.blocks.map((item, index) => (
						<PBlock key={index} blockData={item} />
					))}
				</div>
			</div>
		)
	}
})
