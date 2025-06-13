import { computed, defineComponent, nextTick, provide, type InjectionKey } from 'vue'
import { PBlock, CmdBoard } from '../index'
import { Paper } from '@yak-paper/core'
import style from './style/page.module.scss'
import { store } from '../../store'
import { Creator } from './creator'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = Paper.instance
		const creator = Creator.getInstance(paper, store)

		paper.keydownManager.on('newLine', (blockId) => {
			const index = store.findIndexById(blockId)
			creator.createNewLineByIndex(index + 1)
		})

		// 尝试在创建一个块到最后
		const tryCreateNewLineToLast = async () => {
			const lastBlock = store.data[store.data.length - 1]

			if (lastBlock?.block?.isEmpty) {
				// 如果最后一行是空的块则聚焦
				creator._blur()
				await nextTick()
				const block = lastBlock.block

				block.focus?.(paper.selectionManager)
				return
			}

			creator.createNewLineByIndex(store.data.length)
		}

		provide(pageInjectKey, { paper })

		return { tryCreateNewLineToLast, paper, a: computed(() => paper.cmdBoardManager.suggestions) }
	},
	render() {
		const { tryCreateNewLineToLast, paper } = this

		return (
			<div class={style.page} onClick={tryCreateNewLineToLast}>
				{/* 编辑宿主 */}

				<CmdBoard />
				<article
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
				</article>
			</div>
		)
	}
})
