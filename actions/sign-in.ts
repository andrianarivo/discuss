import * as auth from '@/auth'

export default async function signIn() {
  return auth.signIn('github')
}
