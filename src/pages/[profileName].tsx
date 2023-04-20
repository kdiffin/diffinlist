import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { MdAdd, MdArrowDownward } from "react-icons/md";
import Avatar from "~/components/Avatar";
import Loading, { LoadingSpinner } from "~/components/Loading";
import { Section, SectionCard } from "~/components/Section";
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
    });

  console.log(playlists);

  if (!userData) throw new Error("Data not found");

  return (
    <>
      <Head>
        <title>{userData.username}s profile</title>
      </Head>

      <div className=" flex-col">
        {/* this is the header */}
        <div className=" neutral-lowkey-bg flex  items-center p-8 ">
          <div className="flex items-center gap-4">
            <Avatar
              loading={false}
              width_height={110}
              src={userData.profileImageUrl}
            />

            <div className="flex flex-col  gap-2">
              <p className="text-4xl  ">{userData.username}</p>
              <p className=" text-neutral-400">
                This user has {playlists ? playlists.length : "no"} playlist
                {playlists && playlists.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* this is the body */}
        <div className="flex flex-col  gap-12 p-10 py-10">
          {/* playlists should get filtered when clicked on view more */}
          <Section loading={playlistsLoading} name="Playlists">
            {playlists && playlists.length > 0 ? (
              playlists.map((playlist) => {
                return (
                  <SectionCard
                    href={playlist.id}
                    pictureUrl={playlist.pictureUrl}
                    title={playlist.name}
                    key={playlist.id}
                  />
                );
              })
            ) : (
              <p className="flex w-full items-center justify-center p-5 font-medium italic text-neutral-500 ">
                No playlists found
              </p>
            )}
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Songs">
            {playlists
              ? playlists.map((playlist) => {
                  return (
                    <SectionCard
                      href={playlist.id}
                      pictureUrl={playlist.pictureUrl}
                      title={playlist.name}
                      key={playlist.id}
                    />
                  );
                })
              : "No playlists found"}
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Favourited playlists">
            {playlists
              ? playlists.map((playlist) => {
                  return (
                    <SectionCard
                      href={playlist.id}
                      pictureUrl={playlist.pictureUrl}
                      title={playlist.name}
                      key={playlist.id}
                    />
                  );
                })
              : "No playlists found"}
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Favourited songs">
            {playlists
              ? playlists.map((playlist) => {
                  return (
                    <SectionCard
                      href={playlist.id}
                      pictureUrl={playlist.pictureUrl}
                      title={playlist.name}
                      key={playlist.id}
                    />
                  );
                })
              : "No playlists found"}
          </Section>

          {/* <Section loading={playlistsLoading} name="Songs" />

          <Section loading={playlistsLoading} name="Favourited playlists" />

          <Section loading={playlistsLoading} name="Favourited songs" /> */}
        </div>
      </div>
    </>
  );
}

function Divider({ className }: { className?: string }) {
  return (
    <div className="w-full  ">
      <div className=" flex items-center justify-center border-t border-t-neutral-700 ">
        {" "}
      </div>
    </div>
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
