import { createUser, deleteUser, updateUser } from '../../infrastructure/repositories/userRepository';
import { createTodo, updateTodo, deleteTodo } from '../../infrastructure/repositories/todoRepository';

const Mutation = {
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,

    createTodo: createTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
}

export { Mutation }
