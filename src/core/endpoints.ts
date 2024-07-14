import type { PayloadRequest } from 'payload/types'
import type { Endpoint } from 'payload/config'
import type { PluginOptions } from '../types'
import { handleAuthorization, handleCallback } from './handlers'
import { createSession } from './session'

export const AUTHORIZATION_PATH = '/oauth2/authorization/'
export const CALLBACK_PATH = '/oauth2/callback/'
export const SESSION_PATH = '/oauth2/session/'

export function generateEndpoints(pluginOptions: PluginOptions): Endpoint[] {
  const endpoints = Object.keys(pluginOptions.providers).reduce(
    (customEndpoints: Endpoint[], providerId: string) => {
      customEndpoints.push({
        path: `${AUTHORIZATION_PATH}${providerId}`,
        method: 'get',
        handler: (req: PayloadRequest) =>
          handleAuthorization(req, pluginOptions.providers[providerId]),
      })
      customEndpoints.push({
        path: `${CALLBACK_PATH}${providerId}`,
        method: 'get',
        handler: (req: PayloadRequest) => handleCallback(req, pluginOptions.providers[providerId]),
      })
      customEndpoints.push({
        path: `${SESSION_PATH}${providerId}`,
        method: 'get',
        handler: (req: PayloadRequest) =>
          createSession(
            req,
            pluginOptions.userCollection?.slug ?? 'users',
            pluginOptions.sub?.name ?? 'sub',
            pluginOptions.providers[providerId],
            {
              successRedirect: pluginOptions.successRedirect ?? '/admin',
              failureRedirect: pluginOptions.failureRedirect ?? '/admin/login',
            },
          ),
      })
      return customEndpoints
    },
    [],
  )

  return endpoints
}
