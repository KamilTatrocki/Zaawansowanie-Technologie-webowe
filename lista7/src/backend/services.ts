
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getUserById, createUser, deleteUser, updateUser } from './user'
import { getTodoById, createTodo, updateTodo, deleteTodo } from './todo'
import { getTestTodosForUser,getTestUserForTodo } from './API';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// w sumie to są nasze serwisy
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
   },
   testTodos: async (parent, args, context, info) => {
      return await getTestTodosForUser(parent.id)
   }
}

const TodoItem = {
    user: async (parent, args, context, info) => {
        return await prisma.user.findFirstOrThrow({where: { id: parent.user }})
    },
    testUser: async (parent, args, context, info) => {
        return await getTestUserForTodo(parent.user)
    }
}



export { Query }
export { Mutation }

export { User }
export { TodoItem }
