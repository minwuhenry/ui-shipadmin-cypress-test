import { BrowserRouter as Router } from 'react-router-dom'
import '@enterprise-ui/canvas-ui-css'
import { HelveticaForTarget } from '@enterprise-ui/component-font'
import { EnvProvider } from '@praxis/component-runtime-env'
import { AuthProviderWrapper } from './globalComponents/AuthProviderWrapper'

import './globalStyles/customStyles.css'
import { Main } from './views/Main'
import apiConfig from './globalConfig/apiConfig'

const App = () => {
  return (
    <EnvProvider
      commonConfig={apiConfig}
      configPath={
        process.env.NODE_ENV === 'development'
          ? '/config.json'
          : '/app-environment'
      }
    >
      <HelveticaForTarget variants={['n4', 'n5', 'n7']} />
      <Router>
        <AuthProviderWrapper>
          <Main />
        </AuthProviderWrapper>
      </Router>
    </EnvProvider>
  )
}

export default App
