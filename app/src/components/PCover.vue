<script setup lang="ts">
import { createApi } from 'unsplash-js'
import { useStorage } from '@vueuse/core'
import { Button } from '@yyui/yy-ui'

const url = useStorage('URL', '')

const api = createApi({
	accessKey: 'N96Xr_q3HeOJQ29LrANQkM_2EhZqWvmidNDq-0lf3Bk'
})

const getNew = () => {
	api.photos.getRandom({ count: 1 }).then((result) => {
		console.log('result', result)

		if (result.errors) {
			url.value = ''
		} else {
			url.value = (result.response as any[])[0].urls.regular
		}
	})
}

if (!url.value) getNew()
</script>

<template>
	<div
		w-full
		h-300px
		border-b="1px solid amber"
		overflow-hidden
		flex="~ col"
		justify-center
		items-center
		pos-relative
	>
		<div pos-absolute pos-bottom-10px pos-right-9xl>
			<Button type="primary" @click="getNew">get new</Button>
		</div>

		<img :src="url" w-full @dragstart.prevent />
	</div>
</template>
