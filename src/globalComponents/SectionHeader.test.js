import { render, screen } from '@testing-library/react'
import { definePropertyUtil } from '../util/util'
import '@testing-library/jest-dom'
import { SectionHeader } from './SectionHeader'

definePropertyUtil()

describe('<SectionHeader />', () => {
  test('should render with h4 if page heading is passed into it', () => {
    render(<SectionHeader pageHeading="Hello World" />)
    screen.queryByText('Hello World')
  })

  test('should NOT render with h4 if page heading is NOT passed into it', () => {
    render(<SectionHeader />)
    const pageHeading = screen.queryByText('Hello World')
    expect(pageHeading).not.toBeInTheDocument()
  })
})
