import { init } from "./passkey/index.js"

type Provider =
  | "google"
  | "github"
  | "passkey"
  | "apple"
  | "cognito"
  | "gitlab"
  | "msft-entra"
  | "slack"
  | "atlassian"
  | "auth0"
  | "discord"
  | "facebook"
  | "jumpcloud"

export function signin(provider: Provider, apiBase: string = '/api', redirect_action: string = '', redirect_context: string = '') {
  if (provider === "passkey") {
    init()
  } else {
    const link = document.createElement("a")
    link.href = `${apiBase}/admin/oauth/authorization/${provider}?redirect_action=${redirect_action}&redirect_context=${redirect_context}`
    link.click()
  }
}
