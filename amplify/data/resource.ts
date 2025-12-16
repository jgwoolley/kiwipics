import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    Picture: a
        .model({
            kiwiName: a.string().required(),
            kiwiLocation: a.string().required(),
            picturePath: a.string().required(),
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