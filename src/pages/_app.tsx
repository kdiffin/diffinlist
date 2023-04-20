import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import Settings from "~/components/Settings";
import CreatePlaylist from "~/components/CreatePlaylist";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>diffinlist</title>
      </Head>

      <div className=" [&>div]:dark-scrollbar smooth-scroll flex h-screen [&>div]:w-full [&>div]:overflow-y-scroll ">
        <ClerkProvider {...pageProps}>
          <Sidebar />
          <Component {...pageProps} />
          <Settings />
          <CreatePlaylist />
        </ClerkProvider>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
