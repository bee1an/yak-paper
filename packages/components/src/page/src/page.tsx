import { defineComponent, nextTick, provide, type InjectionKey } from 'vue'
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
			return PageWarehouse.instance.addData({ type: 'text' })
		}

		paper.editableKeydownManager.on('newLine', () => {
			addEmptyText()
		})

		const focusLast = () => {
			let index = BlockWarehouse.instance.blocks.length - 1

			if (index < 0) {
				index = addEmptyText()
			}

			nextTick(() => {
				console.log('123', BlockWarehouse.instance.blocks, index)
				BlockWarehouse.instance.blocks[index].focus?.(paper.selectionManager)
			})
		}

		provide(pageInjectKey, { paper })

		return { focusLast, paper }
	},
	render() {
		const { focusLast, paper } = this

		return (
			<div class={style.page} onClick={focusLast}>
				{/* 编辑宿主 */}
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
