import { render } from '@testing-library/react'
import { definePropertyUtil } from '../util/util'

import { ErrorContent } from './ErrorContent'

definePropertyUtil()

describe('<ErrorContent />', () => {
  test('should render with the "error.message" passed to it', () => {
    const HAL9000 = 'I’m afraid I can’t do that.'
    const { getByText } = render(<ErrorContent error={{ message: HAL9000 }} />)
    getByText(new RegExp(HAL9000, 'g'))
  })
})
