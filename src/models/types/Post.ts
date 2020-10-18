import { objectType, extendType } from '@nexus/schema';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.author({ type: 'User' })
  }
})


export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOnePost()
    t.crud.updateOnePost()
    t.crud.deleteOnePost({
      type: 'Post',
      resolve: async (_root, _args, { prisma }) => {
        const id = _args.where.id as number;
        await prisma.post.delete({where: { id }})
        return null;
      }
     })
  }
})


export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.posts()
    t.crud.post()
  }
})