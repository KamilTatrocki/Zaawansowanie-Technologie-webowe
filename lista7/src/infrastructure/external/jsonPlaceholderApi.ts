import axios from "axios"
import { GraphQLError } from "graphql";

export async function getTestTodosForUser(userId) {
    try {
        const todos = await axios.get("https://jsonplaceholder.typicode.com/todos", { timeout: 5000 })
        return todos.data
            .filter((todo) => todo.userId === userId)
            .map(({ userId, id, title, completed }) =>
                ({ id: id, title: title, completed: completed, user: userId }))
    } catch (e) {
        console.log(e)
         throw new GraphQLError(`Could not connect to API`, {
            extensions: {
               // http: { status: 404 },
               code: 'NOT_FOUND'
            }
         });
    }
}

export async function getTestUserForTodo(userId) {
    try {
        const users = await axios.get("https://jsonplaceholder.typicode.com/users", { timeout: 5000 })
        return users.data
            .filter((user) => user.id === userId)
            .map((user) =>
                ({ id: user.id, name: user.name, email: user.email, login: user.username }))
            .at(0) ?? null
    } catch {
         throw new GraphQLError(`Could not connect to API`, {
            extensions: {
               // http: { status: 404 },
               code: 'NOT_FOUND'
            }
         });
    }
}
