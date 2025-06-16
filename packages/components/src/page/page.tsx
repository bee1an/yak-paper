import { defineComponent, nextTick, provide, type InjectionKey } from 'vue'
import { PBlock, CmdBoard } from '../index'
import { Paper } from '@yak-paper/core'
import style from './style/page.module.scss'

export const pageInjectKey = Symbol('pageInjectKey') as InjectionKey<{
	paper: Paper
}>

export default defineComponent({
	name: 'PPage',
	setup() {
		const paper = Paper.instance
		const sections = paper.sections
		const creator = sections.creator

		// 尝试在创建一个块到最后
		const tryCreateNewLineToLast = async () => {
			const lastBlock = sections.data[sections.data.length - 1]

			if (lastBlock?.block?.isEmpty) {
				// 如果最后一行是空的块则聚焦
				sections.blurAll()
				await nextTick()
				const block = lastBlock.block

				block.focus?.(paper.selectionManager)
				return
			}

			creator.createNewLineByIndex(sections.data.length)
		}

		provide(pageInjectKey, { paper })

		return { tryCreateNewLineToLast, paper }
	},
	render() {
		const { tryCreateNewLineToLast, paper } = this

		return (
			<div class={style.page} onClick={tryCreateNewLineToLast}>
				<CmdBoard />
				{/* 编辑宿主 */}
				<article
					class={style.host}
					onCompositionstart={() => paper.compositionManager.onStart()}
					onCompositionend={() => paper.compositionManager.onEnd()}
					onClick={(event) => event.stopPropagation()}
					contenteditable
					onKeydown={paper.keydownManager.handle}
					onBeforeinput={(e: Event) => paper.beforeinputManager.handle(e as InputEvent)}
					onInput={(e: Event) => paper.inputManager.handle(e as InputEvent)}
					onBlur={paper.blurManager.handle}
				>
					<div class={style.blocks}>
						{paper.sections.data.map((item) => (
							<PBlock key={item.id} id={item.id} />
						))}
					</div>
				</article>
			</div>
		)
	}
})
