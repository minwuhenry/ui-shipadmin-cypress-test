// WARNING: Canvas v7 - Component "Container" has been deprecated. Please remove this import.
import {
  Button,
  Card,
  Grid,
  Layout,
  Heading,
} from '@enterprise-ui/canvas-ui-react'
import { useAuth } from '@praxis/component-auth'

export const LogIn = () => {
  const auth = useAuth()
  const { login } = auth

  return (
    // ATTENTION: Canvas v7 - Component "Layout" now accepts prop theme={ "default" | "target" | "blue" | "grey" | "green" | "roundel" }
    // ATTENTION: Canvas v7 - Component "Layout" now accepts prop darkMode={ true | false } - Specify darkmode to override the client browser's preferences. Applications previously using the "First Avenue" theme should set darkMode={true}.
    <Layout data-testid="loginLayout" fullWidth>
      <Layout.Body includeRail>
        <Grid.Container
          className="praxcss-height100vh"
          align="center"
          justify="center"
        >
          <Grid.Item xs={10} md={6} lg={4}>
            <Card>
              <div className="hc-pa-normal hc-ta-center">
                <Heading>Welcome to Your App!</Heading>
              </div>
              <div className="hc-pa-normal hc-pt-none">
                <p className="hc-fs-section">Please login to access content.</p>
              </div>
              <div className="hc-pa-normal hc-pt-none">
                <Button
                  data-testid="loginButton"
                  type="primary"
                  size="expanded"
                  fullWidth
                  onClick={login}
                >
                  Log In
                </Button>
              </div>
            </Card>
          </Grid.Item>
        </Grid.Container>
      </Layout.Body>
    </Layout>
  )
}

export default LogIn
