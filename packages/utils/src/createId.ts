import { uid } from 'uid'

export const createId = (length: number = 32) => uid(length)
