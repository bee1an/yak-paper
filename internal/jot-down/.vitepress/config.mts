import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

const upRoot = path.join(__dirname, '../')

const sidebar = fs.readdirSync(upRoot).reduce((pre, file) => {
	if (!file.endsWith('.md') || file === 'index.md') {
		return pre
	}

	pre.push({
		text: fs
			.readFileSync(path.join(upRoot, file), 'utf-8')
			.match(/[^#].*/)?.[0]
			.trim(),
		link: `/${file.replace('.md', '')}`
	})

	return pre
}, [] as any)

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: '开发笔记',
	description: '关于富文本编辑器',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: '首页', link: '/' },
			{ text: '笔记', link: sidebar[0].link }
		],

		sidebar,

		// socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
		search: {
			provider: 'local'
		},

		docFooter: {
			prev: '上一篇',
			next: '下一篇'
		}
	}
})
