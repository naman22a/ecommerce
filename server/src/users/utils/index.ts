import { User } from '@prisma/client';

export const excludeDetails = (user: User) => {
    const { password, isVerified, tokenVersion, ...result } = user;
    return result;
};
