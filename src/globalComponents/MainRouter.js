import { Routes, Route, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@praxis/component-logging'

import { ErrorContent } from '../globalComponents/ErrorContent'
import { APIHistories } from '../views/APIHistories'

export const MainRouter = () => {
  const location = useLocation()
  return (
    <ErrorBoundary key={location.pathname} FallbackComponent={ErrorContent}>
      <Routes>
        <Route exact path="/apihistories" element={<APIHistories />} />
        <Route exact path="/" element={<APIHistories />} />
      </Routes>
    </ErrorBoundary>
  )
}
