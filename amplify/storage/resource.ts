import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'kiwiPics',
  access: (allow) => ({
    'picture-submissions/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
  })
});