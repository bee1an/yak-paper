import type { App } from 'vue'
import { PPaperInstaller } from './paper'
import { PPaperboardInstaller } from './paperboard'

const components = [PPaperInstaller, PPaperboardInstaller]

const install = (app: App) => components.forEach((component) => app.use(component))

export default { install }
