import { Prisma } from '../../../generated/prisma/client';
import { GraphQLError } from 'graphql';
import { toInt, toBool } from '../../domain/validation';
import { prisma } from '../db/prismaClient';

async function getTodoById(parent, { id }, context, info) {
    const numericId = toInt(id)

    const todo = await prisma.todo.findUnique({
        where: { id: numericId }
    });

    if (!todo) {
        throw new GraphQLError(`Todo with ID ${numericId} not found.`, {
            extensions: {
                // http: { status: 404 },
                code: 'NOT_FOUND'
            }
        });
    }

    return todo;
}

async function createTodo(parent, { todo }, context, info) {
    const userId = toInt(todo.user_id)
    toBool(todo.completed)

    try {
        return await prisma.todo.create({
            data: {
                title: todo.title,
                completed: todo.completed,
                user: userId
            }
        })
    } catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
                throw new GraphQLError(`Could not create todo. User with ID ${userId} not found.`, {
                    extensions: {
                        // http: { status: 404 },
                        code: 'NOT_FOUND'
                    }
                });
            }
        }
    }
}

async function updateTodo(parent, { id, todo }, context, info) {
    const numericId = toInt(id)
    const userId = toInt(todo.user_id)
    toBool(todo.completed)

    try {
        return await prisma.todo.update({
            where: { id: numericId },
            data: {
                title: todo.title,
                completed: todo.completed,
                user: userId
            }
        })
    } catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
                throw new GraphQLError(`Could not update todo. User with ID ${userId} not found.`, {
                    extensions: {
                        // http: { status: 404 },
                        code: 'NOT_FOUND'
                    }
                });
            }
            else if (e.code === "P2025") {
                throw new GraphQLError(`Could not update todo`, {
                    extensions: {
                        // http: { status: 404 },
                        code: 'NOT_FOUND'
                    }
                });
            }
        }
    }
}

async function deleteTodo(parent, { id }, context, info) {
    const numericId = toInt(id)

    try {
        return await prisma.todo.delete({
            where: { id: numericId }
        })
    } catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                throw new GraphQLError(`Could not delete todo`, {
                    extensions: {
                        // http: { status: 404 },
                        code: 'NOT_FOUND'
                    }
                });
            }
        }
    }
}

export { getTodoById }
export { createTodo }
export { updateTodo }
export { deleteTodo }
