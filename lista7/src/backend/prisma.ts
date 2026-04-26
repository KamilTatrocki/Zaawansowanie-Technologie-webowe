import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// w sumie to są nasze serwisy
const Query = {
   users: async () => {
       //a to nasze repo
      return await prisma.user.findMany()
   },
   todos: async () => {
      return await prisma.todo.findMany()
   }
}


// entity specific

const User = {
   todos: async (parent, args, context, info) => {
      return await prisma.todo.findMany({where: { user: parent.id }})
   }
}

const TodoItem = {
    user: async (parent, args, context, info) => {
        return await prisma.user.findMany()
    }
}

// funkcje do filtracji/fetchowania


export { Query }
export { User }
export { TodoItem }
