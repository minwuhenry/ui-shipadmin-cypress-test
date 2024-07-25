import { fireEvent, render } from '@testing-library/react'
import { definePropertyUtil } from '../util/util'

import LogIn from './LogIn'

const mockLogin = jest.fn()

jest.mock('@praxis/component-auth', () => ({
  ...jest.requireActual('@praxis/component-auth'),
  useAuth: () => {
    return {
      login: mockLogin,
    }
  },
}))

definePropertyUtil()

describe('<LogIn />', () => {
  test('should render', () => {
    const { getByTestId } = render(<LogIn />)
    getByTestId('loginLayout')
  })

  test('should have a log in button', () => {
    const { getByTestId } = render(<LogIn />)
    getByTestId('loginButton')
  })

  test('button should call login function', () => {
    const { getByTestId } = render(<LogIn login={mockLogin} />)
    fireEvent.click(getByTestId('loginButton'))
    expect(mockLogin).toHaveBeenCalled()
  })
})
