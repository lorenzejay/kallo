import { useQuery } from '@tanstack/react-query'
import supabase from '../utils/supabaseClient'


const getUser = async (userId : string | undefined) => {
  if (!userId) throw Error("No user");
  const { data, error,  } = await supabase
    .from('users')
    .select()
    .match({ user_id: userId })
    .single()

  if(error) {
    throw new Error(error.message)
  }

  if(!data) {
    throw new Error("User not found")
  }

  return data
}

export default function useUser() {
  const user = supabase.auth.user();
  // if (user === null) return;
  return useQuery(['user'], () => getUser(user?.id))
}
