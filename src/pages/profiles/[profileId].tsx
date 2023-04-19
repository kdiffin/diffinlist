import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { MdAdd, MdArrowDownward } from "react-icons/md";
import Avatar from "~/components/Avatar";
import { ssgHelper } from "~/server/helpers/generateSSGHelper";
import { api } from "~/utils/api";

function Profile({ profileId }: { profileId: string }) {
  //the usequery will never hit loading because of ssg
  const { data: userData } = api.profile.getProfileByProfileId.useQuery({
    profileId: profileId,
  });

  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getPlaylistsByProfileId.useQuery({
      profileId: profileId,
    });

  if (!userData) throw new Error("Data not found");

  return (
    <>
      <Head>
        <title>{userData.username}s profile</title>
      </Head>

      <div className="flex-col ">
        {/* this is the header */}
        <div className=" neutral-lowkey-bg flex  items-center p-8 ">
          <div className="flex items-center gap-4">
            <Avatar width_height={110} src={userData.profileImageUrl} />

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
          <Section name="Playlists">
            {playlists
              ? [...playlists, ...playlists, ...playlists, ...playlists].map(
                  (playlist) => {
                    return (
                      <SectionCard
                        href={playlist.id}
                        pictureUrl={playlist.pictureUrl}
                        title={playlist.name}
                        key={playlist.id}
                      />
                    );
                  }
                )
              : "No playlists found"}
          </Section>

          <Divider />

          <Section name="Songs">
            {playlists
              ? [
                  ...playlists,
                  ...playlists,
                  ...playlists,
                  ...playlists,
                  ...playlists,
                ].map((playlist) => {
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

          <Section name="Favourited playlists">
            {playlists
              ? [...playlists, ...playlists, ...playlists, ...playlists].map(
                  (playlist) => {
                    return (
                      <SectionCard
                        href={playlist.id}
                        pictureUrl={playlist.pictureUrl}
                        title={playlist.name}
                        key={playlist.id}
                      />
                    );
                  }
                )
              : "No playlists found"}
          </Section>

          <Divider />

          <Section name="Favourited songs">
            {playlists
              ? [...playlists, ...playlists, ...playlists, ...playlists].map(
                  (playlist) => {
                    return (
                      <SectionCard
                        href={playlist.id}
                        pictureUrl={playlist.pictureUrl}
                        title={playlist.name}
                        key={playlist.id}
                      />
                    );
                  }
                )
              : "No playlists found"}
          </Section>

          {/* <Section name="Songs" />

          <Section name="Favourited playlists" />

          <Section name="Favourited songs" /> */}
        </div>
      </div>
    </>
  );
}

function Section({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <Link href={`playlists`}>
        <div className="mb-12 text-center text-xl xl:mb-10 xl:text-left">
          {name}
        </div>
      </Link>

      <div className="grid grid-cols-8 grid-rows-1 flex-wrap justify-center  gap-5 overflow-hidden xl:justify-normal ">
        {children}
      </div>

      <Link
        href={`playlists`}
        className="mt-12 flex w-full items-center justify-center
       gap-2 text-center  font-semibold  text-neutral-600 "
      >
        Show more <MdAdd className="mt-1 " />
      </Link>
    </div>
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

function SectionCard({
  title,
  pictureUrl,
  href,
}: {
  title: string;
  pictureUrl: string;
  href: string;
}) {
  console.log(pictureUrl);

  return (
    <Link
      href={"/playlists/" + href}
      className="neutral-lowkey-bg flex  flex-col items-center gap-2 p-4 hover:bg-neutral-700/30"
    >
      {pictureUrl === "" ? (
        <p className="flex h-full max-h-[160px] w-full max-w-[160px] items-center justify-center italic text-neutral-500">
          No image for playlist
        </p>
      ) : (
        <Image
          alt={title + "'s image"}
          width={150}
          height={150}
          src={pictureUrl}
        />
      )}
      <p className="">{title}</p>
      {/* <p>{createdAt} • {</p> */}
    </Link>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileId = context.params?.profileId as string;
  const ssg = ssgHelper;

  if (!searchQueryProfileId)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  await ssg.profile.getProfileByProfileId.prefetch({
    profileId: searchQueryProfileId,
  });

  return {
    props: {
      //ngl this is a weird pattern
      //but what it does is basically it allows us to fetch from trpc while still having the benefits of ssg
      //we have to pass the context again down as props and then pass it on to the usequery
      trpcState: ssg.dehydrate(),
      profileId: searchQueryProfileId,
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
