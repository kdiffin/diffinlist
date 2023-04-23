import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { profile } from "console";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { MdAdd, MdArrowDownward } from "react-icons/md";
import CustomError from "~/components/CustomError";
import HeadComponent from "~/components/HeadComponent";
import Avatar from "~/components/ui/Avatar";
import Button from "~/components/ui/Button";
import Loading, { LoadingSpinner } from "~/components/ui/Loading";
import { Section, SectionCard } from "~/components/ui/Section";
import { ImageSkeleton } from "~/components/ui/Skeletons";
import { ssgHelper } from "~/server/helpers/generateSSGHelper";
import { api } from "~/utils/api";

// ui is very similar to profileName, so I copy pasted that component.
// I could have made the ui a component and the data fetching parts hooks, but I dont like abstracting such large files.

function Profile({
  profileName,
  playlistName,
}: {
  profileName: string;
  playlistName: string;
}) {
  //the usequery will never hit loading because of ssg
  //also trpc uses react query under the hood
  const { data: playlist } = api.playlist.getPlaylist.useQuery({
    playlistName: playlistName,
    profileName: profileName,
  });

  if (!playlist) throw new Error("couldnt find playlist");

  return (
    <>
      <HeadComponent
        currentUrl={`https://diffinlist.vercel.app/${profileName}/${playlistName}`}
        image={playlist.pictureUrl}
        description={
          "Come on over to diffinlist and share your own playlist! :3"
        }
        title={`${playlistName} | ${profileName}`}
      />

      <div className=" flex-col">
        {/* this is the header */}
        <div className=" neutral-lowkey-bg flex   items-center p-8 ">
          <div className="flex items-center gap-6">
            {playlist.pictureUrl ? (
              <img
                width={130}
                height={130}
                className="rounded-sm"
                loading="eager"
                src={playlist.pictureUrl}
              />
            ) : (
              <ImageSkeleton className="h-[130px] w-[130px]" />
            )}

            <div className="flex flex-col gap-2  ">
              <p className="text-4xl">{playlistName}</p>
              <div className="text-sm">
                {playlist.genre ? (
                  <p className=" text-neutral-400">
                    Aesthetic / genre : {playlist.genre}
                  </p>
                ) : (
                  <></>
                )}

                <Link
                  href={`/${playlist.authorName}`}
                  className=" text-neutral-400"
                >
                  Author : {playlist.authorName}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* this is the body */}
        <div className="flex flex-col  gap-12 p-10 py-10">
          {/* playlists should get filtered when clicked on view more */}
          {/* the reason i didnt reuse the .map function is because I lose typesafety. as different APIS return different objects */}
          {/* <Section loading={playlistsLoading} name="Playlists">
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
              <p className="flex w-full items-center justify-center p-5 font-medium italic text-neutral-500 ">
                No playlists found
              </p>
            )}
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Songs">
            no playlists found
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Favourited playlists">
            no playlists found
          </Section>

          <Divider />

          <Section loading={playlistsLoading} name="Favourited songs">
            no playlists found
          </Section> */}

          {/* <Section loading={playlistsLoading} name="Songs" />

          <Section loading={playlistsLoading} name="Favourited playlists" />

          <Section loading={playlistsLoading} name="Favourited songs" /> */}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileName = context.params?.profileName as string;
  const searchQueryPlaylistName = context.params?.playlist
    ? context.params?.playlist[0]
    : "";

  const ssg = ssgHelper;

  if (!searchQueryProfileName)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  if (!searchQueryPlaylistName)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  await ssg.playlist.getPlaylist.prefetch({
    profileName: searchQueryProfileName,
    playlistName: searchQueryPlaylistName,
  });

  return {
    props: {
      //ngl this is a weird pattern
      //but what it does is basically it allows us to fetch from trpc while still having the benefits of ssg
      //we have to pass the context again down as props and then pass it on to the usequery
      trpcState: ssg.dehydrate(),
      profileName: searchQueryProfileName,
      playlistName: searchQueryPlaylistName,
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
