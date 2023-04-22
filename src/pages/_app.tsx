import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import Settings from "~/components/Settings";
import CreatePlaylist from "~/components/CreatePlaylist";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>diffinlist</title>
      </Head>

      <div className=" [&>div]:dark-scrollbar smooth-scroll flex h-screen [&>div]:w-full [&>div]:overflow-y-scroll ">
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "!rounded-sm !mr-5 !bg-zinc-700 !p-3 !text-white",
          }}
        />
        <Sidebar />
        <Component {...pageProps} />
        <Settings />
        <CreatePlaylist />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
