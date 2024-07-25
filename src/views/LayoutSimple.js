// WARNING: Canvas v7 - Component "Container" has been deprecated. Please remove this import.
import { Card, Grid, Layout } from '@enterprise-ui/canvas-ui-react'

import { SectionHeader } from '../globalComponents/SectionHeader'

export const LayoutSimple = () => {
  return (
    <>
      <SectionHeader pageHeading="Simple Layout" />
      <Layout.Body data-testid="homePage" includeRail>
        <Card>
          <div className="hc-pa-dense">
            <Grid.Container>
              <Grid.Item>
                <p>Your content</p>
              </Grid.Item>
            </Grid.Container>
          </div>
        </Card>
      </Layout.Body>
    </>
  )
}
