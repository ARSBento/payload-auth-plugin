import type {
  AccountInfo,
  OIDCProviderConfig,
  ProviderConfig,
} from "../../types.js"

type GoogleAuthConfig = ProviderConfig

function GoogleAuthProvider(config: GoogleAuthConfig): OIDCProviderConfig {
  return {
    ...config,
    id: "google",
    scope: "openid email profile",
    issuer: "https://accounts.google.com",
    name: "Google",
    algorithm: "oidc",
    profile: (profile): AccountInfo => {
      return {
        sub: profile.sub as string,
        name: profile.name as string,
        email: profile.email as string,
        picture: profile.picture as string,
        redirect_action: profile.redirect_action as string,
        redirect_context: profile.redirect_context as string,
      }
    },
  }
}

export default GoogleAuthProvider
