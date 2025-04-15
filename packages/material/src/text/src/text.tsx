import { defineComponent, type ExtractPropTypes } from 'vue'
import style from '../style/text.module.scss'
import { useThemeProps, useThemeStyle } from '@yak-paper/composables'
import themeDefined from '../style/theme'
import themeManager from '../../../style'

export const PTextProps = {
	...useThemeProps()
}
export type PTextProps = ExtractPropTypes<typeof PTextProps>

export default defineComponent({
	name: 'PText',
	props: PTextProps,
	setup(props) {
		const themeStyle = useThemeStyle(
			themeDefined,
			props,
			themeManager.createCssVar.bind(themeManager)
		)

		return { themeStyle }
	},
	render() {
		const { themeStyle } = this

		return <div style={themeStyle} contenteditable={true} class={style.wrapper}></div>
	}
})
