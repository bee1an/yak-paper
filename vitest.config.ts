import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
	// TODO: type error
	// plugins: [vue(), vueJsx()],
	test: {
		environment: 'jsdom'
	}
})
