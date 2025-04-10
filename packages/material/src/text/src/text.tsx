import { defineComponent } from 'vue'
import style from '../style/text.module.scss'

export default defineComponent({
	name: 'PText',
	render() {
		return <div contenteditable={true} class={style.wrapper}></div>
	}
})
