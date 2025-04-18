import { onScopeDispose, toValue, unref, watch, type MaybeRefOrGetter } from 'vue'
import { onInput } from './on-input'

export const useInput = (target: MaybeRefOrGetter<HTMLElement | null>) => {
	const onIpt = (payload: Event) => onInput(payload)

	const cleanup = () => {
		toValue(target)?.removeEventListener('input', onIpt)
	}

	const stopWatcher = watch(
		() => unref(toValue(target)),
		(rawTarget) => {
			if (!rawTarget) {
				cleanup()
			}

			rawTarget?.addEventListener('input', onIpt)
		},
		{ immediate: true }
	)

	onScopeDispose(() => {
		cleanup()
		stopWatcher()
	}, true)
}

export * from './on-input'
