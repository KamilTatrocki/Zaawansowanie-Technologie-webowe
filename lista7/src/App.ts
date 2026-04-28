import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { Query } from './application/resolvers/query'
import { Mutation } from './application/resolvers/mutation'
import { User } from './application/resolvers/user'
import { TodoItem } from './application/resolvers/todoItem'


const schema = loadSchemaSync('./src/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const resolvers = {
        Query: Query,
        Mutation: Mutation,
        User: User,
        TodoItem: TodoItem
    }

const resolvedSchema = addResolversToSchema({
    schema: schema,
    resolvers
})



const yoga = createYoga({
  schema: resolvedSchema,
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
