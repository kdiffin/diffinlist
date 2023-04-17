import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Sidebar from "~/components/Sidebar";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.profile.getProfileByProfileId.useQuery({
    profileId: "user_2OYTYwZKYuMi1jdx9T1UsgiBwU9",
  });

  // ok so the index has some fun stuff (recent posts, playlists displayed, etc.)
  // search is for searching users and playlists
  // each user finna be like this /userid
  // each playlist will be defined like this /userid/playlists/playlistid

  //first thing to do - add clerk

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Home;
