import { render } from '@testing-library/react'
import { setupTests } from '@praxis/config-defaults'
import '@testing-library/jest-dom'

import App from './App'

import MockLogIn from './views/LogIn'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
})

const mockLogin = jest.fn()
jest.mock('@praxis/component-auth', () => ({
  ...jest.requireActual('@praxis/component-auth'),
  useAuth: () => {
    return {
      login: mockLogin,
    }
  },
}))

jest.mock('./globalComponents/AuthProviderWrapper', () => {
  return {
    __esModule: true,
    AuthProviderWrapper: () => {
      return <MockLogIn></MockLogIn>
    },
    default: () => {
      return <MockLogIn></MockLogIn>
    },
  }
})

jest.mock('@praxis/component-runtime-env', () => {
  return {
    EnvProvider: ({ children }) => {
      return <>{children}</>
    },
  }
})

describe('<App />', () => {
  test('should render', () => {
    const { getByTestId } = render(<App />)
    getByTestId('loginLayout')
  })
})
