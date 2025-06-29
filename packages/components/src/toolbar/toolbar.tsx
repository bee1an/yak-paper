import { Popover, Icon } from '@yyui/yy-ui'
import { defineComponent, h, inject, withModifiers } from 'vue'
import { pageInjectKey } from '../page/page'
import Bold from './icons/Bold.vue'
import Italic from './icons/Italic.vue'
import Underline from './icons/Underline.vue'
import style from './style/toolbar.module.scss'
import type { FormatType } from 'yak-paper'

const componentMap: {
	[key in FormatType]?: any
} = {
	bold: h(Icon, null, () => h(Bold)),
	italic: h(Icon, null, () => h(Italic)),
	underline: h(Icon, null, () => h(Underline))
}

export default defineComponent({
	setup() {
		const { paper } = inject(pageInjectKey)!
		const toolbar = paper.toolbarManager

		return { toolbar }
	},

	render() {
		const { toolbar } = this

		return h(
			Popover,
			{
				trigger: 'manual',
				showPopover: toolbar.visible,
				x: toolbar.triggerContext.x,
				y: toolbar.triggerContext.y,
				placement: 'top-start',
				showArrow: false,
				themeOverrides: { padding: '4px' },
				contentClass: style.toolbar,
				onMousedown: withModifiers(() => null, ['prevent'])
			},
			() =>
				Object.keys(componentMap).map((key) => {
					const k = key as keyof typeof componentMap
					const Component = componentMap[k]
					return (
						<div
							class={style['icon-wrapper']}
							onClick={() =>
								this.toolbar.itemClickHandle(k, toolbar.triggerContext.activeTypes.includes(k))
							}
						>
							<Component
								size={16}
								color={
									toolbar.triggerContext.activeTypes.includes(k) ? 'rgb(35, 131, 226)' : undefined
								}
							></Component>
						</div>
					)
				})
		)
	}
})
