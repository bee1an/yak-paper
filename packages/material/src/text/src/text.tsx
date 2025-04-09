import { defineComponent } from 'vue'

export default defineComponent({
	name: 'PText',
	render() {
		return <span>{this.$slots.default?.()}</span>
	}
})
