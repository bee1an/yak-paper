import path from 'path'

import { fileURLToPath } from 'url'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const rootDir = path.resolve(__dirname, '../../../')

export const pkgDir = path.resolve(rootDir, 'packages')

export const paperDir = path.resolve(pkgDir, 'yak-paper')

export const paperEntry = path.resolve(paperDir, 'src', 'index.ts')

export const paperOutputDir = path.resolve(rootDir, 'dist')
