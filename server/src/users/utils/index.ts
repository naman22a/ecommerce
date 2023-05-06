import { User } from '@prisma/client';

export const excludeDetails = (user: User) => {
    const { password, isVerfied, tokenVersion, ...result } = user;
    return result;
};
