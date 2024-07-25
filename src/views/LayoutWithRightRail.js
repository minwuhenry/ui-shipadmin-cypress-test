// WARNING: Canvas v7 - Component "Container" has been deprecated. Please remove this import.
import { Card, Grid, Layout } from '@enterprise-ui/canvas-ui-react'

import { SectionHeader } from '../globalComponents/SectionHeader'

export const LayoutWithRightRail = () => {
  return (
    <>
      <SectionHeader pageHeading="Layout With Right Rail" />
      <Layout.Body data-testid="layoutWithRightRailMainContent">
        <Card>
          <div className="hc-pa-dense">
            <Grid.Container>
              <Grid.Item>
                <p>Your main content</p>
              </Grid.Item>
            </Grid.Container>
          </div>
        </Card>
      </Layout.Body>
      <Layout.Rail data-testid="layoutWithRightRailRailContent">
        <Card>
          <div className="hc-pa-dense">
            <Grid.Container>
              <Grid.Item>
                <p>Your rail content</p>
              </Grid.Item>
            </Grid.Container>
          </div>
        </Card>
      </Layout.Rail>
    </>
  )
}
