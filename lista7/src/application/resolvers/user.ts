import { prisma } from '../../infrastructure/db/prismaClient';
import { getTestTodosForUser } from '../../infrastructure/external/jsonPlaceholderApi';

// entity specific
const User = {
   todos: async (parent, args, context, info) => {
      return await prisma.todo.findMany({where: { user: parent.id }})
   },
   testTodos: async (parent, args, context, info) => {
      return await getTestTodosForUser(parent.id)
   }
}

export { User }
