import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";

//https://www.npmjs.com/package/@approximant/next-progress
import NextProgress from "@approximant/next-progress";
import Settings from "~/components/Settings";
import CreatePlaylist from "~/components/CreatePlaylist";
import { Toaster } from "react-hot-toast";
import HeadComponent from "~/components/HeadComponent";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <ClerkProvider {...pageProps}>
      <HeadComponent
        image="/images/favicon.ico"
        currentUrl="https://diffinlist.vercel.app"
        title="diffinlist"
      />

      {/* Awesome fork to the Nextjs-progress lib, I was thinkig of adding the debounce feature myself */}
      <NextProgress
        //only triggers after a 1 second delay
        debounce={1000}
        color="#525252"
        height={2}
        showOnShallow={false}
        options={{ showSpinner: false }}
      />

      <div className=" [&>div]:dark-scrollbar smooth-scroll flex  h-screen  [&>div]:w-full [&>div]:overflow-y-scroll ">
        {/* https://react-hot-toast.com/docs  */}
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
