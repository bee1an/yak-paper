import { defineComponent, nextTick, provide, type InjectionKey } from 'vue'
import { PBlock } from '../block'
import { Paper } from '@yak-paper/core'
import style from './style/page.module.scss'
import { BlockAdapter, store } from '../../store'
import { createId } from '@yak-paper/utils'
import type { TextBlock } from '@yak-paper/material'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = Paper.instance

		const addEmptyText = (index: number) => {
			const block = new BlockAdapter(createId(), 'text')

			store.addByIndex(block, index)
			return block
		}

		paper.keydownManager.on('newLine', (blockId) => {
			const index = store.findIndexById(blockId)
			createNewLineByIndex(index + 1)
		})

		const everyBlur = () => {
			store.data.forEach((item) => item.block?.blur?.())
		}

		const createNewLineByIndex = async (index: number) => {
			const blockAdapter = addEmptyText(index)

			everyBlur()

			await nextTick()

			const block = blockAdapter.block!
			block.focus?.(paper.selectionManager)
			;(block as TextBlock).bus.on('click', () => {
				everyBlur()
			})
		}

		const tryCreateNewLineToLast = async () => {
			const lastBlock = store.data[store.data.length - 1]

			if (lastBlock?.block?.isEmpty) {
				everyBlur()
				await nextTick()
				const block = lastBlock.block
				block.focus?.(paper.selectionManager)
				return
			}

			createNewLineByIndex(store.data.length)
		}

		provide(pageInjectKey, { paper })

		return { tryCreateNewLineToLast, paper }
	},
	render() {
		const { tryCreateNewLineToLast, paper } = this

		return (
			<div class={style.page} onClick={tryCreateNewLineToLast}>
				{/* 编辑宿主 */}
				<div
					class={style.host}
					onCompositionstart={() => paper.compositionManager.onStart()}
					onCompositionend={() => paper.compositionManager.onEnd()}
					onClick={(event) => event.stopPropagation()}
					contenteditable
					onKeydown={paper.keydownManager.handle}
					onInput={paper.inputManager.handle}
					onBlur={paper.blurManager.handle}
				>
					<div class={style.blocks}>
						{store.data.map((item) => (
							<PBlock key={item.id} id={item.id} />
						))}
					</div>
				</div>
			</div>
		)
	}
})
