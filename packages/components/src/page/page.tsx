import { defineComponent, nextTick, provide, type InjectionKey } from 'vue'
import { PBlock } from '../block'
import { Paper } from '@yak-paper/core'
import style from './style/page.module.scss'
import { BlockAdapter, store } from '../../store'
import { createId } from '@yak-paper/utils'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = new Paper()

		const addEmptyText = () => {
			const block = new BlockAdapter(createId(), 'text')

			store.add(block)
			return block
		}

		paper.keydownManager.on('newLine', () => {
			focusLast()
		})

		const focusLast = () => {
			const blockAdapter = addEmptyText()

			nextTick(() => {
				blockAdapter.block?.focus(paper.selectionManager)
			})
		}

		provide(pageInjectKey, { paper })

		const compositionStart = () => {
			console.log('', 'compositionStart')
		}

		return { focusLast, paper, compositionStart }
	},
	render() {
		const { focusLast, paper, compositionStart } = this

		return (
			<div class={style.page} onClick={focusLast}>
				{/* 编辑宿主 */}
				<div
					class={style.host}
					onCompositionstart={compositionStart}
					onClick={(event) => event.stopPropagation()}
					contenteditable
					onKeydown={paper.keydownManager.handle}
					onInput={paper.inputManager.handle}
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
