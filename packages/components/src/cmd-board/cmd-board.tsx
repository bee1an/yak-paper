import { defineComponent, Teleport, Transition, inject, withModifiers, computed } from 'vue'
import { Menu, Scrollbar, px, type MenuItem } from '@yyui/yy-ui'
import style from './style/cmd-board.module.scss'
import { pageInjectKey } from '../page/page'
import type { TypeName } from '@yak-paper/material'

export default defineComponent({
	name: 'CmdBoard',
	setup() {
		const { paper } = inject(pageInjectKey)!

		const itemClickHandle = (option: MenuItem) => {
			paper.cmdBoardManager.itemClickHandle(option.key as TypeName)
		}

		const boradVisible = computed(() => {
			return paper.cmdBoardManager.active && paper.cmdBoardManager.suggestions.length > 0
		})

		return { paper, itemClickHandle, boradVisible }
	},
	render() {
		const { cmdBoardManager } = this.paper

		return (
			<Teleport to="body">
				<Transition
					enterFromClass={style['fade-enter-from']}
					enterActiveClass={style['fade-enter-active']}
				>
					{this.boradVisible && (
						<div
							class={style.board}
							style={{
								left: px(cmdBoardManager.rangeOption?.cursorSite.x),
								top: px(cmdBoardManager.rangeOption?.cursorSite.y)
							}}
							onMousedown={withModifiers(() => null, ['prevent'])} // 阻止默认, 不抢焦点
						>
							<Scrollbar contentStyle={{ padding: '4px' }}>
								<Menu
									options={cmdBoardManager.suggestions}
									themeOverrides={{ itemHeight: '35px', marginTop: '2px' }}
									onItem-click={this.itemClickHandle}
								/>
							</Scrollbar>
						</div>
					)}
				</Transition>
			</Teleport>
		)
	}
})
