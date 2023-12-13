'use client'

import {useSession} from 'next-auth/react'
import {Avatar, NavbarItem, Popover, PopoverContent, PopoverTrigger} from '@nextui-org/react'
import * as actions from '@/actions'
import {Button} from '@nextui-org/button'

export default function HeaderAuth() {
  const session = useSession()
  let authContent: React.ReactNode
  if(session.status === 'loading') {
    authContent = null
  } else if(session.data?.user) {
    authContent =
        <Popover placement="left">
          <PopoverTrigger>
            <Avatar src={session.data?.user.image || ''}/>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <form action={actions.signOut}>
                <Button type="submit" color="default" variant="flat">Sign Out</Button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
  } else {
    authContent = (
        <>
          <NavbarItem>
            <form action={actions.signIn}>
              <Button type="submit" color="secondary" variant="bordered">Sign In</Button>
            </form>
          </NavbarItem>
          <NavbarItem>
            <form action={actions.signIn}>
              <Button type="submit" color="primary" variant="flat">Sign Up</Button>
            </form>
          </NavbarItem>
        </>
    )
  }
  return authContent
}