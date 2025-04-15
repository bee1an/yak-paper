import { ThemeManager } from '@yak-paper/theme-utils'
import lightCommon from './light-common'
import darkCommon from './dark-common'

const themeManager = new ThemeManager()

themeManager.add('light', lightCommon)
themeManager.add('dark', darkCommon)

export default themeManager
