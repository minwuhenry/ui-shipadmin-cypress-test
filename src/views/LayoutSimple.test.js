import { render } from '@testing-library/react'
import { definePropertyUtil } from '../util/util'

import { LayoutSimple } from './LayoutSimple'

definePropertyUtil()

describe('<LayoutSimple />', () => {
  test('should contain a headerMenuButton', () => {
    const { getByTestId } = render(<LayoutSimple />)
    getByTestId('homePage')
  })
})
