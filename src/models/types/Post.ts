import { objectType, extendType, stringArg, intArg, arg } from '@nexus/schema';
import { createWriteStream, ReadStream } from 'fs';
import { join } from 'path';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.imgUrl();
    t.model.author({ type: 'User' })
  }
})

interface UploadProcess {
  stream: any,
  filename: string;
  mimetype: string;
}

interface ReturnUpload {
  path?: string;
  filename?: string;
  mimetype?: string;
}

const uploadProcessing = ({stream, filename, mimetype}: UploadProcess): Promise<ReturnUpload> => {
  const uploadFolderPath = join(__dirname, '..', '..', '..', 'uploades');
  const path = `${uploadFolderPath}/${Date.now()}-${filename}`;
  
  return new Promise((resolve, reject) => {
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  })
}


export const AddNewPost = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addNewPost', {
      type: 'Post',
      nullable: false,
      args: {
        title: stringArg({ required: true }),
        content: stringArg({ required: true }),
        by: intArg({ required: true }),
        image: arg({ type: 'Upload', required: false })
      },
      resolve: async (_root, args, { prisma }) => {
        let timeout: any;
        let path: string | undefined = '';
        try {
          // const { image }  = args;
          // if(args?.image) {
          //   const { createReadStream, mimetype, filename, encoding } = await args?.image;
          //   // console.log(image)
          //   const stream = createReadStream();
          //   const resultes = await uploadProcessing({stream, filename, mimetype})
          //   // path = resultes?.path;
          //   console.log(resultes?.filename)
          // }
          // timeout = setTimeout(() => {}, 300)
          return await prisma.post.create({
            data: {
              title: args.title,
              content: args.content,
              imgUrl: path !== '' || path !== undefined ? path : '',
              author: {
                connect: {
                  id: args.by
                }
              }
            },
          })

        } catch(e) {
          throw new Error(e);
        }

      }
    })
  }
})

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
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