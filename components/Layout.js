import Head from "next/head";

function Layout(props) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {props.children}
    </>
  );
}

export default Layout;
