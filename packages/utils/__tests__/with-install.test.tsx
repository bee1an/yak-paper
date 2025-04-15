import { describe, expect, it } from 'vitest'
import { withInstall } from '../src/with-install'
import { createApp, defineComponent } from 'vue'

describe('with-install.ts', () => {
	const App = defineComponent({
		name: 'App',
		render() {
			return <div>App</div>
		}
	})
	const app = createApp(App)

	it('withInstall', () => {
		const cmp = defineComponent({
			name: 'Cmp'
		})
		app.use(withInstall(cmp))
		expect(app.component('Cmp')).toBeDefined()

		const cmp2 = defineComponent({})
		app.use(withInstall(cmp2, 'Cmp2'))
		expect(app.component('Cmp2')).toBeDefined()
	})
})
