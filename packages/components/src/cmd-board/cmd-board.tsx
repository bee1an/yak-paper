import { defineComponent, inject, withModifiers, computed } from 'vue'
import { Menu, Popover, Scrollbar, type MenuItem } from '@yyui/yy-ui'
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
			<>
				<Popover
					placement="bottom-start"
					trigger="manual"
					showPopover={this.boradVisible}
					x={cmdBoardManager.rangeOption?.cursorSite.x}
					y={cmdBoardManager.rangeOption?.cursorSite.y}
					showArrow={false}
					themeOverrides={{
						boxShadow: undefined,
						borderRadius: undefined,
						fontSize: undefined,
						textColor: undefined,
						padding: undefined,
						backgroundColor: undefined
					}}
				>
					<div
						class={style.board}
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
				</Popover>
			</>
		)
	}
})
