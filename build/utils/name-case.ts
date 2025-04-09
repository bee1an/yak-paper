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
