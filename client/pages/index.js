import Head from "next/head";
import Layout from "../components/layout";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Custom CRM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main>
          <h1>Freelancin - a custom cms for freelancers = home page</h1>
        </main>
      </Layout>
    </div>
  );
}
