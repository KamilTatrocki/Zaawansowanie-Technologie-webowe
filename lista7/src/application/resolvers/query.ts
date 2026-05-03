import { prisma } from '../../infrastructure/db/prismaClient';
import { getUserById } from '../../infrastructure/repositories/userRepository';
import { getTodoById } from '../../infrastructure/repositories/todoRepository';

const Query = {
   users: async () => {
       //a to nasze repo
      return await prisma.user.findMany()
   },
   user: getUserById,
   todos: async () => {
      return await prisma.todo.findMany()
   },
   todo: getTodoById
}

export { Query }
