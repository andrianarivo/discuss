import {z} from 'zod'
import {auth} from '@/auth'

const createPostSchema = z.object({
  title: z.string()
      .min(3)
      .regex(/^[a-z-]+$/,{message: 'Must be lowercase letters or dashes without spaces.'}),
  content: z.string().min(10).max(255),
})

interface CreatePostFormState {
  title?: string[]
  content?: string[]
  _form?: string[]
}

export default async function createPost(formState: CreatePostFormState, formData: FormData): Promise<CreatePostFormState> {
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
      _form: ['You must be signed in to create a topic.']
    }
  }

  return {}
}