import type { App } from 'vue'
import { PPaperboardInstaller } from './paperboard'

const components = [PPaperboardInstaller]

const install = (app: App) => components.forEach((component) => app.use(component))

export default { install }
