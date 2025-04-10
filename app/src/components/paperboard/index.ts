import PPaperboard from './PPaperboard.vue'
import { withInstall } from 'yak-paper'

const PPaperboardInstaller = withInstall(PPaperboard, 'PPaperboard')
export { PPaperboard, PPaperboardInstaller }

declare module 'vue' {
	export interface GlobalComponents {
		PPaperboard: typeof PPaperboard
	}
}
