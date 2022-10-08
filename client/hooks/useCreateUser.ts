import { useMutation } from "react-query"
import supabase from "../utils/supabaseClient"
import { SignUpCredSupbaseAuth } from "../types/userTypes";



const createUser = async (user: SignUpCredSupbaseAuth) => {
  // Check if username exists
  const { data: userWithUsername } = await supabase
    .from('users')
    .select('*')
    .eq('username', user.username)
    .single()

  if(userWithUsername) {
    throw new Error('User with username exists')
  }

  const { user: data, error: signUpError } = await supabase.auth.signUp({
    email: user.email,
    password: user.password
  })

  if(signUpError) {
    throw signUpError
  }

  return data
}

export default function useCreateUser(user: SignUpCredSupbaseAuth) {
  return useMutation(() => createUser(user), {
    // create on supabase auth then add that to our userDatabase (they handle passwords for us)   
    //match by id
    onSuccess: async(data) => {
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            user_id: data?.id,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email
          }
        ])

      if(insertError) {
        throw insertError
      }

      return insertData
    }
  })
}