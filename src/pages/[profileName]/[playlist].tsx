import { useUser } from "@clerk/nextjs";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { profile } from "console";
import { matchSorter } from "match-sorter";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { MdAdd, MdArrowDownward, MdSearch } from "react-icons/md";
import CreateSong from "~/components/CreateSong";
import CustomError from "~/components/CustomError";
import Avatar from "~/components/ui/Avatar";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
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

  const router = useRouter();
  const { user } = useUser();

  const { data, isLoading: songsLoading } = api.song.getSongs.useQuery({
    profileName: profileName,
    playlistName: playlistName,
  });

  if (!playlist) throw new Error("couldnt find playlist");

  const songs = matchSorter(
    data ? data : [],

    router.query && typeof router.query.search === "string"
      ? router.query.search
      : "",
    { keys: ["name"] }
  );

  return (
    <>
      <div className=" flex-col">
        {/* this is the header */}
        <div className=" neutral-lowkey-bg flex items-center   justify-between p-8 ">
          <div className="flex items-center  gap-6">
            {playlist.pictureUrl ? (
              <div className="h-[130px] w-[130px]">
                <img
                  width={130}
                  height={130}
                  className=" h-full  w-full rounded-sm object-cover"
                  loading="eager"
                  src={playlist.pictureUrl}
                />
              </div>
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

          {/* add ternary checking if ur author */}
        </div>

        {/* this is the body */}
        <div className="flex flex-col  gap-12 p-10 py-10">
          <Section
            hideShowMore={true}
            showSearchSong={true}
            loading={songsLoading}
            name="Songs"
          >
            <>
              {songs && songs.length > 0 ? (
                songs.map((song) => {
                  return (
                    <SectionCard
                      type="song"
                      authorName={song.authorName}
                      username={user && user.username ? user.username : ""}
                      href={{
                        query: { ...router.query, song: song.name },
                      }}
                      shallow
                      pictureUrl={song.pictureUrl!}
                      title={song.name}
                      key={song.id}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </>

            {user?.username === playlist.authorName && (
              <SectionCard
                type="song"
                authorName=""
                username="a"
                title="Add song"
                addSong={true}
                pictureUrl=""
                shallow
                href={{
                  pathname: router.route,
                  query: {
                    ...router.query,
                    showCreateSong: "true",
                  },
                }}
              />
            )}
          </Section>
        </div>

        {/* this component gets its open and close logic through query params */}
        <CreateSong />
      </div>

      <Head>
        {/* Primary Meta Tags  */}
        <title>{`${playlist.name} | ${playlist.authorName}`}</title>
        <meta
          name="title"
          content={`${playlist.name} | ${playlist.authorName}`}
        />
        <link rel="icon" href={playlist.pictureUrl} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta
          property="og:url"
          content={`https://diffinlist.vercel.app/${playlist.authorName}/${playlist.name}`}
        />
        <meta
          property="og:title"
          content={`${playlist.name} | ${playlist.authorName}`}
        />

        <meta property="og:image" content={playlist.pictureUrl} />

        {/* <!-- Twitter -- /> */}
        <meta property="twitter:card" content={playlist.pictureUrl} />
        <meta
          property="twitter:url"
          content={`https://diffinlist.vercel.app/${playlist.authorName}/${playlist.name}`}
        />
        <meta
          property="twitter:title"
          content={`${playlist.name} | ${playlist.authorName}`}
        />

        <meta property="twitter:image" content={playlist.pictureUrl}></meta>
      </Head>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileName = context.params?.profileName as string;
  const searchQueryPlaylistName = context.params?.playlist as string;

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
