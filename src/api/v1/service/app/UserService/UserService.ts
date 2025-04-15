import prisma from 'prisma-client-e0927cad762eeb69c59bae79cd800ee80b7461adc19bab150b560ff44b385830/prismaClient';
import { AppError } from '../../../middleware/errorHanding';

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.cmsUser.findUnique({
      where: { cms_user_id: userId },
      // include: {
      //   wishlists: true,
      //   orders: true,
      //   payments: true,
      //   parent_relation: {
      //     include: {
      //       parent: true,
      //     },
      //   },
      //   child_relations: true,
      // },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  } catch (error) {
    throw error;
  }
}; 