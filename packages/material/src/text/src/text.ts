import { useThemeStyle } from '@yak-paper/composables'
import type { DataAgreer, RenderAgreer } from '@yak-paper/core'
import themeDefined from '../style/theme'
import themeManager from '../../../style'
import { nextTick, reactive, useTemplateRef } from 'vue'
import style from '../style/text.module.scss'

const props = reactive({ theme: 'light' })

const themeStyle = useThemeStyle(themeDefined, props, themeManager.createCssVar.bind(themeManager))

interface TextDataAgreer extends DataAgreer {
	type: 'text'

	formate?: { type: 'text' | 'blob'; content: string }[]
}

export class TextRender implements RenderAgreer {
	readonly type = 'text'

	readonly tagName = 'div'

	readonly attr = {
		class: style.block,
		contenteditable: true,
		['data-placeholder']: '请输入',
		style: themeStyle,
		ref: 'textRef'
	}

	children: RenderAgreer['children'] = []

	constructor(option?: TextDataAgreer) {
		this.children = option?.formate
			?.map((item) => {
				switch (item.type) {
					case 'text':
						return item.content

					case 'blob':
						return {
							tagName: 'span',
							attr: {
								style: {
									backgroundColor: 'red'
								}
							},
							children: [item.content]
						}

					default:
						return null
				}
			})
			.filter((item) => item !== null)

		// TODO
		const textRef = useTemplateRef<HTMLElement>('textRef')
		nextTick(() => textRef.value?.normalize())

		return reactive(this) as unknown as TextRender
	}
}
