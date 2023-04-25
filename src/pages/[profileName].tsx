import { TRPCError } from "@trpc/server";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import Avatar from "~/components/ui/Avatar";
import Divider from "~/components/ui/Divider";
import { Section, SectionCard } from "~/components/ui/Section";
import { ssgHelper } from "~/server/helpers/generateSSGHelper";
import { api } from "~/utils/api";

function Profile({ profileName }: { profileName: string }) {
  //the usequery will never hit loading because of ssg
  const { data: userData } = api.profile.getProfileByProfileName.useQuery({
    profileName: profileName,
  });

  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getPlaylistsByProfileName.useQuery({
      profileName: profileName,
      takeLimit: 8,
    });

  if (!userData) throw new Error("Data not found");

  return (
    <>
      <div className=" flex-col">
        {/* this is the header */}

        <div className=" neutral-lowkey-bg flex   items-center p-8 ">
          <div className="flex items-center gap-4">
            <Avatar
              className="p-1"
              loading={false}
              width_height={130}
              src={userData.profileImageUrl}
            />

            <div className="flex flex-col  gap-2">
              <p className="text-4xl  ">{userData.username}</p>
              <p className=" text-neutral-400">
                This user has {playlists ? playlists.length : "no"} playlist
                {playlists && playlists.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* this is the body */}
        <div className="flex flex-col  gap-12 p-10 py-10">
          {/* playlists should get filtered when clicked on view more */}
          {/* the reason i didnt reuse the .map function is because I lose typesafety. as different APIS return different objects */}
          <Section loading={playlistsLoading} name="Playlists">
            {playlists && playlists.length > 0 ? (
              playlists.map((playlist) => {
                return (
                  <SectionCard
                    href={`/${playlist.authorName}/${playlist.name}`}
                    pictureUrl={playlist.pictureUrl}
                    title={playlist.name}
                    key={playlist.id}
                  />
                );
              })
            ) : (
              <p className="flex w-full items-center justify-center p-5 text-sm font-medium text-neutral-500 ">
                No playlists found
              </p>
            )}
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Songs">
            <p className="flex w-full items-center justify-center p-5  text-sm text-neutral-500 ">
              No songs found
            </p>
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Favourited playlists">
            <p className="flex w-full items-center justify-center p-5  text-sm text-neutral-500 ">
              No playlists found
            </p>
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Favourited songs">
            <p className="flex w-full items-center justify-center p-5  text-sm text-neutral-500 ">
              No playlists found
            </p>
          </Section>

          {/* <Section loading={playlistsLoading} name="Songs" />

          <Section loading={playlistsLoading} name="Favourited playlists" />

          <Section loading={playlistsLoading} name="Favourited songs" /> */}
        </div>
      </div>

      <Head>
        {/* Primary Meta Tags  */}
        <title>{`${userData.username} | ${userData.profileImageUrl}`}</title>
        <meta name="title" content={`${userData.username} | ${profileName}`} />
        <link rel="icon" href={userData.profileImageUrl} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta
          property="og:url"
          content={`https://diffinlist.vercel.app/${userData.username}`}
        />
        <meta
          property="og:title"
          content={`${userData.username} | ${profileName}`}
        />

        <meta property="og:image" content={userData.profileImageUrl} />

        {/* <!-- Twitter -- /> */}
        <meta property="twitter:card" content={userData.profileImageUrl} />
        <meta
          property="twitter:url"
          content={`https://diffinlist.vercel.app/${profileName}/${userData.username}`}
        />
        <meta
          property="twitter:title"
          content={`${userData.username} | ${profileName}`}
        />

        <meta
          property="twitter:image"
          content={userData.profileImageUrl}
        ></meta>
      </Head>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileName = context.params?.profileName as string;
  const ssg = ssgHelper;

  if (!searchQueryProfileName)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  await ssg.profile.getProfileByProfileName.prefetch({
    profileName: searchQueryProfileName,
  });

  return {
    props: {
      //ngl this is a weird pattern
      //but what it does is basically it allows us to fetch from trpc while still having the benefits of ssg
      //we have to pass the context again down as props and then pass it on to the usequery
      trpcState: ssg.dehydrate(),
      profileName: searchQueryProfileName,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Profile;
