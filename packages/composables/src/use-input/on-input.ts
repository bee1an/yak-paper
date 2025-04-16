export const onInput = (payload: Event) => {
	if (!(payload.target instanceof HTMLElement)) return

	const target = payload.target

	// 每次输入检查当前元素的内容
	console.log('target', target.textContent)

	if (target.textContent === '') {
		target.textContent = ''
	}
}
