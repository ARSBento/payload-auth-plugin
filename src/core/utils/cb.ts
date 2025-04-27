export function getCallbackURL(
  baseURL: string,
  appType: "admin" | "app",
  provider: string,
  redirect_action?: string,
  redirect_context?: string,
): URL {
  const callback_url = new URL(baseURL) as URL
  callback_url.pathname = `/api/${appType}/oauth/callback/${provider}`
  callback_url.search = ""

  return callback_url
}
