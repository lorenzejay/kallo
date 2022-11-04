export const configWithToken = (token: string) => {
  if (!token) return;
  const config = {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  };
  return config;
};
