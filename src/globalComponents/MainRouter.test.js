import { BrowserRouter as Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { definePropertyUtil } from '../util/util'

import { MainRouter } from './MainRouter'

definePropertyUtil()

describe('<MainRouter />', () => {
  test('should default to displaying the home page route', () => {
    const { getByTestId } = render(
      <Router>
        <MainRouter />
      </Router>,
    )
    getByTestId('homePage')
  })
})
