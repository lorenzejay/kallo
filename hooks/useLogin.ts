import { useMutation } from '@tanstack/react-query'
import { LoginCredentials } from '../types/userTypes'
import supabase from '../utils/supabaseClient'

const login = async ({email, password}: LoginCredentials) => {
  const { data: {user }, error } = await supabase.auth.signInWithPassword({
    email, 
    password
  })

  if(error) {
    throw new Error(error.message)
  }

  return user;
}

export default function  useLogin({ email, password }: LoginCredentials) {
  return useMutation(['user'], () => login({email, password}))
}
