import theme from '../../../../style'
import common from './common'

export default theme.fastTheme('dark', function () {
	return {
		...common,
		width: this.width,
		color: this.primaryColor
	}
})
