import {z} from 'zod'
import {auth} from '@/auth'
import {db} from '@/db'
import {Post} from '@prisma/client'
import {revalidatePath} from 'next/cache'
import paths from '@/paths'
import {redirect} from 'next/navigation'

const createPostSchema = z.object({
  title: z.string()
      .min(3),
  content: z.string().min(10).max(255),
})

interface CreatePostFormState {
  title?: string[]
  content?: string[]
  _form?: string[]
}

export default async function createPost(slug: string, formState: CreatePostFormState, formData: FormData): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if(!result.success) {
    return result.error.flatten().fieldErrors
  }

  const session = await auth()
  if(!session || !session.user) {
    return {
      _form: ['You must be signed in to create a post.']
    }
  }

  const topic = await db.topic.findFirst({
    where: {slug}
  })

  if(!topic) {
    return {
      _form: ['Topic not found.']
    }
  }

  let post: Post
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id
      }
    })
  } catch (err: unknown) {
    if(err instanceof Error) {
      return {
        _form: [err.message]
      }
    } else {
      return {
        _form: ['Something went wrong']
      }
    }
  }

  revalidatePath(paths.topicShow(topic.slug))
  redirect(paths.postShow(topic.slug, post.id))
}