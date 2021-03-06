import { objectType, extendType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.email()
    t.model.posts({ type: 'Post' })
  }
})


export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneUser()
    t.crud.updateOneUser()
  }
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.users()
    t.crud.user()
  }
})

