import { defineComponent, Teleport, Transition, inject, withModifiers } from 'vue'
import { Menu, Scrollbar, px, type MenuItem } from '@yyui/yy-ui'
import style from './style/cmd-board.module.scss'
import { pageInjectKey } from '../page/page'

export default defineComponent({
	name: 'CmdBoard',
	setup() {
		const { paper } = inject(pageInjectKey)!

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const itemClickHandle = (option: MenuItem) => {
			paper.cmdBoardManager.exit()
		}

		return { paper, itemClickHandle }
	},
	render() {
		const { cmdBoardManager } = this.paper

		return (
			<Teleport to="body">
				<Transition
					enterFromClass={style['fade-enter-from']}
					enterActiveClass={style['fade-enter-active']}
				>
					{cmdBoardManager.active && (
						<div
							class={style.board}
							style={{
								left: px(cmdBoardManager.rangeOption?.cursorSite.x),
								top: px(cmdBoardManager.rangeOption?.cursorSite.y)
							}}
							onMousedown={withModifiers(() => {}, ['prevent'])} // 阻止默认, 不抢焦点
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
