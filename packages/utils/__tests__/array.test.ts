import { describe, it, expect } from 'vitest'
import { getArrayHeadDeepestArray, getArrayTailDeepestArray } from '../src/array'

describe('getArrayTailDeepestArray', () => {
	it('should return the same array if last element is not an array', () => {
		const input = [1, 2, 3]
		expect(getArrayTailDeepestArray(input)).toEqual([1, 2, 3])
	})

	it('should return the deepest tail array in a nested structure', () => {
		const input = [1, [2, [3, [4]]]]
		expect(getArrayTailDeepestArray(input)).toEqual([4])
	})

	it('should handle multiple branches and return the correct tail', () => {
		const input = [1, 2, [3, 4], [5, [6]]]
		expect(getArrayTailDeepestArray(input)).toEqual([6])
	})

	it('should return empty array if the deepest tail is empty', () => {
		const input = [[[[]]]]
		expect(getArrayTailDeepestArray(input)).toEqual([])
	})

	it('should return empty array when input is empty', () => {
		const input: any[] = []
		expect(getArrayTailDeepestArray(input)).toEqual([])
	})

	it('should handle arrays with empty arrays inside', () => {
		const input = [1, [], 2]
		expect(getArrayTailDeepestArray(input)).toEqual([1, [], 2])
	})

	it('should return empty array even if it is deeply nested', () => {
		const input = [1, [2, [3, []]]]
		expect(getArrayTailDeepestArray(input)).toEqual([])
	})
})

describe('getArrayHeadDeepestArray', () => {
	it('should return the array itself if first element is not an array', () => {
		const input = [1, 2, 3]
		expect(getArrayHeadDeepestArray(input)).toEqual(input)
	})

	it('should return the deepest nested array', () => {
		const input = [[[1, 2], 3], 4]
		expect(getArrayHeadDeepestArray(input)).toEqual([1, 2])
	})

	it('should handle deeply nested single-element arrays', () => {
		const input = [[[[[[5]]]]]]
		expect(getArrayHeadDeepestArray(input)).toEqual([5])
	})

	it('should return empty array when input is empty', () => {
		const input: any[] = []
		expect(getArrayHeadDeepestArray(input)).toEqual(input)
	})

	it('should return inner empty array when nested empty arrays are present', () => {
		const input = [[[[[]]]]]
		expect(getArrayHeadDeepestArray(input)).toEqual([])
	})

	it('should return original array if first element is not an array even if others are', () => {
		const input = [{}, [1, 2]]
		expect(getArrayHeadDeepestArray(input)).toEqual(input)
	})
})
