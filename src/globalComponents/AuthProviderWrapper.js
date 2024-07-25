import { AuthProvider } from '@praxis/component-auth'
import { useEnv } from '@praxis/component-runtime-env'

export const AuthProviderWrapper = (props) => {
  const env = useEnv()

  return <AuthProvider {...env.auth}>{props.children}</AuthProvider>
}
