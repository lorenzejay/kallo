import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/layout";

const Tasks = () => {
  const router = useRouter();
  console.log(router.query);
  return <Layout>dasdasda</Layout>;
};

export default Tasks;
