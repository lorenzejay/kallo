export const configWithToken = (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  };
  return config;
};
