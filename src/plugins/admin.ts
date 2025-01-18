import type { Config, Plugin } from "payload"
import { EndpointFactory } from "../core/endpoints"
import { ProvidersConfig } from "../types"
import { PayloadSession } from "../core/session/payload"
import {
  InvalidServerURL,
  MissingUsersCollection,
} from "../core/errors/consoleErrors"
import { buildAccountsCollection } from "../core/collections/admin/accounts"
import { mapProviders } from "../providers/utils"

interface PluginOptions {
  /* Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /*
   * OAuth Providers
   */
  providers: ProvidersConfig[]

  /*
   * Accounts collections config
   */
  accounts?: {
    slug?: string | undefined
    hidden?: boolean | undefined
  }

  /*
   * Path to be redirected to upon successful login
   * @defuault /admin
   */
  successPath?: string

  /* Enable or disable user creation. WARNING: If applied to your admin users collection it will allow ANYONE to sign up as an admin.
   * @default false
   */
  allowSignUp?: boolean
}

export const adminAuthPlugin =
  (pluginOptions: PluginOptions): Plugin =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    if (pluginOptions.enabled === false) {
      return config
    }

    if (!config.serverURL) {
      throw new InvalidServerURL()
    }

    if (!config.admin?.user) {
      throw new MissingUsersCollection()
    }

    config.admin = {
      ...(config.admin ?? {}),
    }

    const { accounts, providers, allowSignUp, successPath } = pluginOptions

    const session = new PayloadSession(
      {
        accountsCollectionSlug: accounts?.slug ?? "accounts",
        usersCollectionSlug: config.admin.user!,
      },
      allowSignUp,
      successPath,
    )
    const mappedProviders = mapProviders(providers)
    const endpoints = new EndpointFactory(mappedProviders)

    // Create accounts collection if doesn't exists
    config.collections = [
      ...(config.collections ?? []),
      buildAccountsCollection(
        {
          slug: accounts?.slug ?? "accounts",
          hidden: accounts?.hidden ?? false,
        },
        config.admin.user!,
      ),
    ]

    config.endpoints = [
      ...(config.endpoints ?? []),
      ...endpoints.payloadOAuthEndpoints({
        sessionCallback: (oauthAccountInfo, scope, issuerName, basePayload) =>
          session.createSession(
            oauthAccountInfo,
            scope,
            issuerName,
            basePayload,
          ),
      }),
    ]
    if (mappedProviders["passkey"]) {
      config.endpoints.push(
        ...endpoints.payloadPasskeyEndpoints({
          rpID: "localhost",
          sessionCallback: (accountInfo, issuerName, basePayload) =>
            session.createSession(accountInfo, "", issuerName, basePayload),
        }),
      )
    }
    return config
  }
