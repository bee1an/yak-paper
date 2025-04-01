import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Text',
	render() {
		return <span>{this.$slots.default?.()}</span>
	}
})
