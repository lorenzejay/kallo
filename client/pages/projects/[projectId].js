import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";

const Projects = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [data, setData] = useState({});
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userInfo.token,
      },
    };
    const { data } = await axios.get(`/api/projects/project/${projectId}`, config);

    setData(data);
  }, [projectId]);

  data && console.log(data.columns);
  //   console.log(paths);
  return (
    <Layout>
      <main className="text-white">
        <h2 className="text-4xl font-bold mb-2">{data.title}</h2>
        {data.message ? (
          <h3>You do not have access to this file</h3>
        ) : (
          <Kanban headerImage={data.header_img} columns={data.columns} />
        )}
      </main>
    </Layout>
  );
};

export default Projects;
