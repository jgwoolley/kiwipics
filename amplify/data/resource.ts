import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    Picture: a
        .model({
            kiwiName: a.string(),
            lat: a.float(),
            long: a.float(),
            picturePath: a.string(),
        })
        .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});