import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'movieDrive',
    access: (allow) => ({
        'public/*': [
            allow.guest.to(['read', 'write', 'delete']),
            allow.authenticated.to(['read', 'write', 'delete']),
        ],
    }),
});
