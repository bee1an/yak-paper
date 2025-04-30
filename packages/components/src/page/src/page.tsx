import { defineComponent, provide, type InjectionKey } from 'vue'
import { PBlock } from '../../block'
import { Paper } from '@yak-paper/core'
import { PageWarehouse } from './warehouse'
import style from '../style/page.module.scss'
import { BlockWarehouse } from '../../block/src/warehouse'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = new Paper()

		const addEmptyText = () => {
			PageWarehouse.instance.addData({ type: 'text' })
		}

		paper.editableKeydownManager.on('newLine', () => {
			addEmptyText()
		})

		const focusLast = () => {
			if (BlockWarehouse.instance.blocks.length === 0) {
				addEmptyText()
			}

			PageWarehouse
		}

		provide(pageInjectKey, { paper })

		return { focusLast, paper }
	},
	render() {
		const { focusLast, paper } = this

		return (
			<div class={style.page} onClick={focusLast}>
				<div
					class={style.host}
					onClick={(event) => event.stopPropagation()}
					contenteditable
					onKeydown={paper.editableKeydownManager.handle}
					onInput={paper.editableInputManager.handle}
				>
					<div class={style.blocks}>
						{PageWarehouse.instance.dataList.map((item, index) => (
							<PBlock key={index} blockData={item} />
						))}
					</div>
				</div>
			</div>
		)
	}
})
