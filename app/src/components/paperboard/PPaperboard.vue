<script setup lang="ts"></script>

<template>
	<div h-screen flex flex-col class="wrapper">
		<!-- <div class="h-screen flex flex-col border-1 border-cyan border-solid"> -->
		<!-- <div class="h-200px flex items-center justify-center bg-cyan-1">banner</div> -->
		<div flex-1><PPaper /></div>
	</div>
</template>

<style scoped>
.wrapper {
	color: rgb(55, 53, 47);
}
.wrapper::selection {
	background: rgba(24, 160, 251, 0.15);
}
</style>
