import { NavLink } from 'react-router-dom'
import { Heading, SideNav, TargetLogo } from '@enterprise-ui/canvas-ui-react'
import { useAuth } from '@praxis/component-auth'
import { useEnv } from '@praxis/component-runtime-env'

export const SideNavigation = ({ isOpen, onRequestClose }) => {
  const auth = useAuth()
  const env = useEnv()

  return (
    <SideNav
      data-testid="sideNav"
      isVisible={isOpen}
      onRequestClose={onRequestClose}
    >
      <SideNav.SkipLink data-testid="sideNavSkipLink" href="#mainContent">
        Skip to Main Content
      </SideNav.SkipLink>
      <SideNav.Header
        data-testid="sideNavLogoHeader"
        as={NavLink}
        to={'/'}
        exact
      >
        <TargetLogo size="expanded" className="hc-mr-dense" />
        <Heading size={5}>ShipAdmin</Heading>
      </SideNav.Header>
      <SideNav.Navigation data-testid="sideNavMainNavArea">
        {auth.isAuthorized(env.auth.apiHistoryAccess) && (
          <SideNav.NavigationItem
            as={NavLink}
            to={'/apihistories'}
            exact
            activeClassName="isSelected"
          >
            API Histories
          </SideNav.NavigationItem>
        )}
      </SideNav.Navigation>
    </SideNav>
  )
}
