import { useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../utils/supabaseClient';
// import supabase from './'

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation(() => logout(), {
    onSuccess: () => {
      queryClient.removeQueries(['user'], { exact: true });
    }
  })
}
