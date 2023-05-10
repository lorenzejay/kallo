import { useMutation } from "@tanstack/react-query";
import { LoginCredentials, SignUpCredSupbaseAuth } from "../types/userTypes";
import supabase from "../utils/supabaseClient";

const register = async ({ email, password }: LoginCredentials) => {
  // @ts-ignore
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return user;
};

export default function useRegister({
  email,
  password,
  firstName,
  lastName,
  username,
}: SignUpCredSupbaseAuth) {
  return useMutation(() => register({ email, password }), {
    // create on supabase auth then add that to our userDatabase (they handle passwords for us)
    //match by id
    onSuccess: async (data) => {
      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            user_id: data?.id,
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
          },
        ]);

      if (insertError) {
        throw insertError;
      }
      return insertData;
    },
  });
}
