// WARNING: Canvas v7 - Component "Container" has been deprecated. Please remove this import.
import { Card, Grid, Layout } from '@enterprise-ui/canvas-ui-react'

import { SectionHeader } from '../globalComponents/SectionHeader'

export const ErrorContent = ({ error }) => {
  return (
    <>
      <SectionHeader pageHeading="Error" />
      <Layout.Body data-testid="layoutWithErrorContent">
        <Card>
          <div className="hc-pa-dense">
            <Grid.Container>
              <Grid.Item>
                <p>Your error content: {error.message}</p>
              </Grid.Item>
            </Grid.Container>
          </div>
        </Card>
      </Layout.Body>
      <Layout.Rail data-testid="layoutWithErrorRailContent">
        <Card>
          <div className="hc-pa-dense">
            <Grid.Container>
              <Grid.Item>
                <p>Your help content</p>
              </Grid.Item>
            </Grid.Container>
          </div>
        </Card>
      </Layout.Rail>
    </>
  )
}
