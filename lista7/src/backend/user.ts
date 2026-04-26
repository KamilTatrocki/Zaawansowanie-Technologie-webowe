import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { GraphQLError } from 'graphql';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function getUserById(parent, args, context, info) {
    const numericId = parseInt(args.id, 10)

    if (isNaN(numericId)) {
        throw new GraphQLError(`Invalid ID provided. Expected a number, got '${args.id}'.`, {
            extensions: {
                // http: { status: 400 },
                code: 'BAD_USER_INPUT'
            }
        });
    }

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

    try {
      return await prisma.user.create({
         data: user
      })
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         throw new GraphQLError(`The login is already taken. Please choose another.`, {
            extensions: {
               // http: { status: 409 },
               code: 'UNIQUE_CONSTRAINT_VIOLATION'
            }
         });
      }
    }
}

export { getUserById }
export { createUser }
