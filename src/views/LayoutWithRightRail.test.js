import { render } from '@testing-library/react'
import { definePropertyUtil } from '../util/util'

import { LayoutWithRightRail } from './LayoutWithRightRail'

definePropertyUtil()

describe('<LayoutWithRightRail />', () => {
  test('should contain a main content area', () => {
    const { getByTestId } = render(<LayoutWithRightRail />)
    getByTestId('layoutWithRightRailMainContent')
  })
  test('should contain a rail content area', () => {
    const { getByTestId } = render(<LayoutWithRightRail />)
    getByTestId('layoutWithRightRailRailContent')
  })
})
