// WARNING: Canvas v7 - Component "Container" has been deprecated. Please remove this import.
import { Grid, Heading, Layout } from '@enterprise-ui/canvas-ui-react'

export const SectionHeader = ({ pageHeading }) => {
  return (
    <Layout.SectionHeader>
      <div className="hc-pa-dense hc-pb-none">
        <Grid.Container spacing="dense">
          {pageHeading && (
            <Grid.Item>
              <Heading data-testid="sectionHeaderHeading" size={4}>
                {pageHeading}
              </Heading>
            </Grid.Item>
          )}
        </Grid.Container>
      </div>
    </Layout.SectionHeader>
  )
}
