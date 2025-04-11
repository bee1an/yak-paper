import { defineComponent } from 'vue'
import { PText } from 'yak-paper'

export default defineComponent({
	name: 'Page',
	render() {
		return (
			<div>
				<PText />
				<PText />
			</div>
		)
	}
})
