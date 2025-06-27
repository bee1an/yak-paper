<script setup lang="ts">
import { confetti } from '@/utils/confetti'

confetti()
</script>

<template>
	<PCover />
	<div w-7xl m-auto m-t><PPaperboard /></div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

body {
	font-family: 'Open Sans', sans-serif;
	font-optical-sizing: auto;
	font-weight: 400;
	font-style: normal;
	font-variation-settings: 'wdth' 100;
}
</style>
