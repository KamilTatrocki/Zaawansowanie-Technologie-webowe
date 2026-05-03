import { Prisma } from '../../../generated/prisma/client';
import { GraphQLError } from 'graphql';
import { toEmail, toInt } from '../../domain/validation';
import { prisma } from '../db/prismaClient';

async function getUserById(parent, { id }, context, info) {
    const numericId = toInt(id)

    const user = await prisma.user.findUnique({
        where: { id: numericId }
    });

    if (!user) {
        throw new GraphQLError(`User with ID ${numericId} not found.`, {
            extensions: {
                // http: { status: 404 },
                code: 'NOT_FOUND'
            }
        });
    }

    return user;
}

async function createUser(parent, { user }, context, info) {
    toEmail(user.email)

    try {
      return await prisma.user.create({
         data: user
      })
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         throw new GraphQLError(`The login is taken. Please choose another.`, {
            extensions: {
               // http: { status: 409 },
               code: 'UNIQUE_CONSTRAINT_VIOLATION'
            }
         });
      }
    }
}


async function updateUser(parent, { id, user }, context, info) {

    const numericId = toInt(id)
    toEmail(user.email)

    try {
      return await prisma.user.update({
         where: { id: numericId },
         data: user
      })
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new GraphQLError(`Could not update user. Login is taken.`, {
               extensions: {
                  // http: { status: 409 },
                  code: 'UNIQUE_CONSTRAINT_VIOLATION'
               }
            });
          }
          else if (e.code == "P2025") {
            throw new GraphQLError(`Could not update user`, {
               extensions: {
                  // http: { status: 404 },
                  code: 'NOT_FOUND'
               }
            });
          }
      }
    }
}


async function deleteUser(parent, { id }, context, info) {

    const numericId = toInt(id)

    try {
      return await prisma.user.delete({
         where: { id: numericId }
      })
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2003") {
            throw new GraphQLError(`Could not delete user. Check if the user has any todos`, {
               extensions: {
                  // http: { status: 409 },
                  code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION'
               }
            });
          }
          else if (e.code == "P2025") {
            throw new GraphQLError(`Could not delete user`, {
               extensions: {
                  // http: { status: 404 },
                  code: 'NOT_FOUND'
               }
            });
          }
      }
    }
}

export { getUserById }
export { createUser }
export { updateUser }
export { deleteUser }
