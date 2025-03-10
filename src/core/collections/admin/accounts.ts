import { CollectionConfig } from "payload"
import { PasskeyFields } from "./accounts/passkeyFields.js"

export function buildAccountsCollection(
  account: {
    slug: string
    hidden: boolean
  },
  customersCollectionSlug: string,
) {
  const accountsCollection: CollectionConfig = {
    slug: account.slug,
    admin: {
      useAsTitle: "id",
      hidden: account.hidden,
    },
    access: {
      read: ({ req: { user } }) => Boolean(user),
      create: () => false,
      update: () => false,
      delete: () => false,
    },
    fields: [
      {
        name: "name",
        type: "text",
      },
      {
        name: "picture",
        type: "text",
      },
      {
        name: "user",
        type: "relationship",
        relationTo: customersCollectionSlug,
        hasMany: false,
        required: true,
        label: "User",
      },
      {
        name: "issuerName",
        type: "text",
        required: true,
        label: "Issuer Name",
      },
      {
        name: "scope",
        type: "text",
      },
      {
        name: "sub",
        type: "text",
        required: true,
      },
      {
        name: "passkey",
        type: "group",
        fields: PasskeyFields,
        admin: {
          condition: (_data, peerData) => {
            if (peerData.issuerName === "Passkey") {
              return true
            }
            return false
          },
        },
      },
    ],
  }
  return accountsCollection
}
