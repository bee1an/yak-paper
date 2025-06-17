<script setup lang="ts">
import { createApi } from 'unsplash-js'
import { useStorage } from '@vueuse/core'
import { Button } from '@yyui/yy-ui'

const store = useStorage('URL', { url: '', timestamp: +new Date() })

const api = createApi({
	accessKey: 'N96Xr_q3HeOJQ29LrANQkM_2EhZqWvmidNDq-0lf3Bk'
})

const getNew = () => {
	api.photos.getRandom({ count: 1 }).then((result) => {
		let url = '',
			timestamp = +new Date()

		if (result.errors) {
			url = ''
		} else {
			const newUrl = new URL((result.response as any[])[0].urls.regular)

			newUrl.searchParams.set('w', '1200')
			newUrl.searchParams.set('h', '300')

			url = newUrl.toString()
		}

		store.value = {
			url,
			timestamp
		}
	})
}

if (!store.value.url || store.value.timestamp + (1000 * 60 * 60) / 50 < +new Date()) getNew()

// if (!url.value) getNew()
</script>

<template>
	<div
		w-full
		h-300px
		overflow-hidden
		flex="~ col"
		justify-center
		items-center
		pos-relative
		bg-gray-1
	>
		<div pos-absolute pos-bottom-10px pos-right-9xl>
			<Button type="primary" @click="getNew">get new</Button>
		</div>

		<img :src="store.url" w-full @dragstart.prevent />
	</div>
</template>
