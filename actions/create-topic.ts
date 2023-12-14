import {z} from 'zod'
import {auth} from '@/auth'
import {Topic} from '@prisma/client'
import {redirect} from 'next/navigation'
import paths from '@/paths'
import {db} from '@/db'
import {revalidatePath} from 'next/cache'

const createTopicSchema = z.object({
  name: z.string()
      .min(3)
      .regex(/^[a-z-]+$/,{message: 'Must be lowercase letters or dashes without spaces.'}),
  description: z.string().min(10).max(255),
})

interface CreateTopicFormState {
  name?: string[]
  description?: string[]
  _form?: string[]
}

export default async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
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

  let topic: Topic
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description
      }
    })
  } catch(err: unknown) {
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

  revalidatePath(paths.home())
  redirect(paths.topicShow(topic.slug))
}