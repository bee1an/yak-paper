/**
 * Convert string from kebab-case to camelCase.
 *
 * @param {string} str
 * @return {string}
 */

export function camelcase(str: string): string {
	return str.split('-').reduce((str, word) => {
		return str + word[0].toUpperCase() + word.slice(1)
	})
}

/**
 * Convert string from camelCase to kebab-case.
 *
 * @param {string} str
 * @return {string}
 */
export function kebabcase(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
