import PPaper from './PPaper.vue'
import { withInstall } from 'yak-paper'

const PPaperInstaller = withInstall(PPaper)
export { PPaper, PPaperInstaller }

declare module 'vue' {
	export interface GlobalComponents {
		PPaper: typeof PPaper
	}
}
