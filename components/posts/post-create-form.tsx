'use client'

import {Button, Input, Popover, PopoverContent, PopoverTrigger, Textarea} from '@nextui-org/react'
import FormButton from '@/components/common/form-button'
import * as actions from '@/actions'
import {useFormState} from 'react-dom'

export default function PostCreateForm() {
  const [formState, action] = useFormState(actions.createPost, {})
  return <div>
    <Popover placement="left">
        <PopoverTrigger>
          <Button color="primary">Create a Post</Button>
        </PopoverTrigger>
        <PopoverContent>
          <form action={action}>
            <div className="flex flex-col gap-4 p-4 w-80">
              <h3 className="text-lg">Create a Post</h3>
              <Input name="title" label="Title" labelPlacement="outside" placeholder="Title" isInvalid={!!formState.title} errorMessage={formState.title?.join(', ')} />
              <Textarea name="content" label="Content" labelPlacement="outside" placeholder="Add a content to your post" isInvalid={!!formState.content} errorMessage={formState.content?.join(', ')} />
              {
                formState._form ?
                  <div className="p-2 bg-red-200 rounded-lg text-red-500">
                    {formState._form?.join(', ')}
                  </div> :
                  null
              }
              <FormButton>Save</FormButton>
            </div>
          </form>
        </PopoverContent>
      </Popover>
  </div>
}