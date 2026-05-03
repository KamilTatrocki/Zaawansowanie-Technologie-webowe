import { prisma } from '../../infrastructure/db/prismaClient';
import { getTestUserForTodo } from '../../infrastructure/external/jsonPlaceholderApi';

// entity specific
const TodoItem = {
    user: async (parent, args, context, info) => {
        return await prisma.user.findFirstOrThrow({where: { id: parent.user }})
    },
    testUser: async (parent, args, context, info) => {
        return await getTestUserForTodo(parent.user)
    }
}

export { TodoItem }
