import {
  Avatar,
  Button,
  Dropdown,
  Grid,
  Layout,
} from '@enterprise-ui/canvas-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { useAuth } from '@praxis/component-auth'

const getInitials = (userInfo) =>
  `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`

export const Header = ({ onSideNavToggle }) => {
  const auth = useAuth()
  const { logout, session } = auth
  return (
    <>
      <Layout.MenuButton>
        <Button
          className="C-MenuButton"
          onClick={onSideNavToggle}
          iconOnly
          data-testid="headerMenuButton"
          aria-label="toggle side nav menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </Layout.MenuButton>
      <Layout.Header />
      <Layout.GlobalActions>
        <Grid.Container justify="flex-end">
          <Grid.Item>
            <Dropdown size="dense" location="bottom-right">
              <Button
                fullWidth="false"
                type="ghost"
                className="praxcss-header__avatar"
                data-testid="headerGlobalActionsButton"
                aria-label="hold-logged-in-user-initials"
              >
                <Avatar aria-label="logged-in-user-initials">
                  {getInitials(session.userInfo)}
                </Avatar>
              </Button>
              <Dropdown.Menu>
                <Dropdown.MenuItem
                  data-testid="headerLogoutButton"
                  onClick={logout}
                >
                  Log Out
                </Dropdown.MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Item>
        </Grid.Container>
      </Layout.GlobalActions>
    </>
  )
}
