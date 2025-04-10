import type { App, Component } from 'vue'

export const withInstall = (component: Component, name?: string) => {
	return {
		install(app: App) {
			if (!component.name && !name) {
				throw new Error('Component name is required')
			}

			app.component(component.name || name!, component)
		}
	}
}
