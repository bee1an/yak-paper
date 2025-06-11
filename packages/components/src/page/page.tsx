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

		const addEmptyText = () => {
			const block = new BlockAdapter(createId(), 'text')

			store.add(block)
			return block
		}

		paper.keydownManager.on('newLine', () => {
			createNewLine()
		})

		const everyBlur = () => {
			store.data.forEach((item) => item.block?.blur?.())
		}

		const createNewLine = async () => {
			const blockAdapter = addEmptyText()

			everyBlur()

			await nextTick()

			const block = blockAdapter.block!
			block.focus?.(paper.selectionManager)
			;(block as TextBlock).bus.on('click', () => {
				everyBlur()
			})
		}

		provide(pageInjectKey, { paper })

		return { createNewLine, paper }
	},
	render() {
		const { createNewLine, paper } = this

		return (
			<div class={style.page} onClick={createNewLine}>
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
						{store.data.map((item, index) => (
							<PBlock key={index} id={item.id} />
						))}
					</div>
				</div>
			</div>
		)
	}
})
