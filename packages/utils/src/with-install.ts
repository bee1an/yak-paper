import type { App, Component } from 'vue'

export const withInstall = (component: Component) => {
	return {
		install(app: App) {
			if (!component.name) {
				throw new Error('Component name is required')
			}

			app.component(component.name, component)
		}
	}
}
