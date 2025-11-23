import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'movieDrive',
    access: (allow) => ({
        'movies/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read', 'write', 'delete']),
        ],
    }),
});
