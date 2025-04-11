import { defineComponent, type ExtractPropTypes } from 'vue'
import style from '../style/text.module.scss'
import { useThemeProps } from '@yak-paper/composables'

export const PTextProps = {
	...useThemeProps()
}
export type PTextProps = ExtractPropTypes<typeof PTextProps>

export default defineComponent({
	name: 'PText',
	props: PTextProps,
	setup(props) {
		return {}
	},
	render() {
		return <div contenteditable={true} class={style.wrapper}></div>
	}
})
