import theme from '../../../../style'
import common from './common'

export default theme.fastTheme('light', function () {
	return {
		...common,
		width: this.width,
		color: this.primaryColor
	}
})
