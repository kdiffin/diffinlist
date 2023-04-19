import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>diffinlist</title>
      </Head>

      <div className=" [&>div]:dark-scrollbar flex h-screen [&>div]:w-full [&>div]:overflow-y-scroll ">
        <ClerkProvider {...pageProps}>
          <Sidebar /> <Component {...pageProps} />
        </ClerkProvider>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
