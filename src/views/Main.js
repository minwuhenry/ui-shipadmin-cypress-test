import { useState } from 'react'
import { Layout } from '@enterprise-ui/canvas-ui-react'
import { useAuth } from '@praxis/component-auth'

import { LogIn } from './LogIn'
import { MainRouter } from '../globalComponents/MainRouter'
import { Header } from '../globalComponents/Header'
import { SideNavigation } from '../globalComponents/SideNavigation'

export const Main = () => {
  const auth = useAuth()
  const { isAuthenticated } = auth

  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const handleSideNavToggle = () => {
    setIsSideNavOpen(!isSideNavOpen)
  }

  if (isAuthenticated()) {
    return (
      // ATTENTION: Canvas v7 - Component "Layout" now accepts prop theme={ "default" | "target" | "blue" | "grey" | "green" | "roundel" }
      // ATTENTION: Canvas v7 - Component "Layout" now accepts prop darkMode={ true | false } - Specify darkmode to override the client browser's preferences. Applications previously using the "First Avenue" theme should set darkMode={true}.
      <Layout data-testid="mainAuthenticatedLayout">
        <Header onSideNavToggle={handleSideNavToggle} />
        <SideNavigation
          isOpen={isSideNavOpen}
          onRequestClose={handleSideNavToggle}
        />
        <MainRouter />
      </Layout>
    )
  } else {
    return <LogIn />
  }
}
