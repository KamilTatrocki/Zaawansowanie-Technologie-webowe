import { getUserById, createUser, deleteUser, updateUser } from './userResolvers';
import { getTodoById, createTodo, updateTodo, deleteTodo } from './todoResolvers';
import { prisma } from '../infrastructure/prismaClient';

const Query = {
   users: async () => {
      return await prisma.user.findMany()
   },
   user: getUserById,
   todos: async () => {
      return await prisma.todo.findMany()
   },
   todo: getTodoById
}

const Mutation = {
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,

    createTodo: createTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
}


// entity specific
//
const User = {
   todos: async (parent, args, context, info) => {
      return await prisma.todo.findMany({where: { user: parent.id }})
   }
}

const TodoItem = {
    user: async (parent, args, context, info) => {
        return await prisma.user.findFirstOrThrow({where: { id: parent.user }})
    }
}



export { Query }
export { Mutation }

export { User }
export { TodoItem }
