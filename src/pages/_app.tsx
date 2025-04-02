import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Head from "next/head";
import Sidebar from "~/components/Sidebar";
import "~/styles/globals.css";
import { api } from "~/utils/api";

//https://www.npmjs.com/package/@approximant/next-progress
import NextProgress from "@approximant/next-progress";
import { Toaster } from "react-hot-toast";
import Delete from "~/components/Delete";
import Settings from "~/components/Settings";
import CreatePlaylist from "~/components/playlist/CreatePlaylist";
import EditPlaylist from "~/components/playlist/EditPlaylist";
import AddSongToPlaylist from "~/components/song/AddSongToPlaylist";
import EditSong from "~/components/song/EditSong";
import Song from "~/components/song/Song";

const MyApp: AppType = ({ Component, pageProps }) => {
  //todo: search.tsx

  return (
    <ClerkProvider {...pageProps}>
      {/* Awesome fork to the Nextjs-progress lib, I was thinkig of adding the debounce feature myself */}
      <NextProgress
        //only triggers after a 1 second delay
        debounce={1000}
        color="#525252"
        height={2}
        showOnShallow={false}
        options={{ showSpinner: false }}
      />

      <div className=" [&>div]:dark-scrollbar smooth-scroll flex  h-screen flex-col md:flex-row  [&>div]:w-full [&>div]:flex-1 [&>div]:overflow-y-scroll ">
        {/* https://react-hot-toast.com/docs  */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "!rounded-sm !mr-5 !bg-zinc-700 !p-3 !text-white",
          }}
        />
        <Sidebar />
        <Component {...pageProps} />

        {/* all modals triggered by query params */}
        <Settings />
        <CreatePlaylist />
        <Song />

        {/* all modals triggered by global state */}
        <AddSongToPlaylist />
        <Delete />

        <EditSong />
        <EditPlaylist />
      </div>

      <Head>
        {/* Primary Meta Tags  */}
        <title>{"diffinlist"}</title>
        <meta name="title" content="diffinlist" />
        <link
          rel="icon"
          href={
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2F70ec%2Fth%2Fpre%2Fi%2F2016%2F164%2Fe%2F4%2Femoticon_cute_cat___facebook_by_thebether-da62hu8.png&f=1&nofb=1&ipt=aa1635971965336a0a75ac721bdadf2b12d7c1472679a7f8be7a76c0b75ff425&ipo=imgs"
          }
        />

        <meta
          name="description"
          content={
            "diffinlist is an awesome playlist sharing app built with the t3 stack !!"
          }
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://diffinlist.vercel.app"} />
        <meta property="og:title" content={"diffinlist"} />
        <meta
          property="og:description"
          content={
            "diffinlist is an awesome playlist sharing app built with the t3 stack !!"
          }
        />
        <meta
          property="og:img"
          content={
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2F70ec%2Fth%2Fpre%2Fi%2F2016%2F164%2Fe%2F4%2Femoticon_cute_cat___facebook_by_thebether-da62hu8.png&f=1&nofb=1&ipt=aa1635971965336a0a75ac721bdadf2b12d7c1472679a7f8be7a76c0b75ff425&ipo=imgs"
          }
        />

        {/* <!-- Twitter -- /> */}
        <meta
          property="twitter:card"
          content={
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2F70ec%2Fth%2Fpre%2Fi%2F2016%2F164%2Fe%2F4%2Femoticon_cute_cat___facebook_by_thebether-da62hu8.png&f=1&nofb=1&ipt=aa1635971965336a0a75ac721bdadf2b12d7c1472679a7f8be7a76c0b75ff425&ipo=imgs"
          }
        />
        <meta
          property="twitter:url"
          content={"https://diffinlist.vercel.app"}
        />
        <meta property="twitter:title" content={"diffinlist"} />
        <meta
          property="twitter:description"
          content={
            "diffinlist is an awesome playlist sharing app built with the t3 stack !!"
          }
        />
        <meta
          property="twitter:img"
          content={
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2F70ec%2Fth%2Fpre%2Fi%2F2016%2F164%2Fe%2F4%2Femoticon_cute_cat___facebook_by_thebether-da62hu8.png&f=1&nofb=1&ipt=aa1635971965336a0a75ac721bdadf2b12d7c1472679a7f8be7a76c0b75ff425&ipo=imgs"
          }
        ></meta>
      </Head>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
