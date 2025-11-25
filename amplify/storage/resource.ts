import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'movieDrive',
    access: (allow) => ({
        'movies/*': [
            allow.guest.to(['read', 'write', 'delete']),
            allow.authenticated.to(['read', 'write', 'delete']),
        ],
        'movies/posters/*': [
            allow.guest.to(['read', 'write', 'delete']),
            allow.authenticated.to(['read', 'write', 'delete']),
        ],
    }),
});
