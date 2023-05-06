import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "./ui/Input";
import { api } from "~/utils/api";
import { useClerk, useUser } from "@clerk/nextjs";
import Button from "./ui/Button";
import Avatar, { AvatarSkeleton } from "./ui/Avatar";
import { MdDelete, MdRemove } from "react-icons/md";
import Divider from "./ui/Divider";
import CustomError from "./CustomError";
import Link from "next/link";
import { ImageSkeleton, SquareSkeleton } from "./ui/Skeletons";

function Song() {
  const router = useRouter();
  //clerk has isLoaded instead of isLoading which is weird
  const [profilePicURL, setProfilePicURL] = useState("");
  const [username, setUsername] = useState("");
  const { user, isLoaded } = useUser();
  const isOpen = Boolean(router.query?.song);

  //shouldFetch makes sure that song only fetches when the modal is actually open
  //cuz this component is mounted all the time
  const {
    data: song,
    isLoading,
    isError,
  } = api.song.getSong.useQuery(
    {
      playlistName:
        router.query.playlist && typeof router.query.playlist[0] === "string"
          ? (router.query.playlist[0] as string)
          : "",

      songName: typeof router.query.song === "string" ? router.query.song : "",

      profileName:
        typeof router.query.profileName === "string"
          ? router.query.profileName
          : "",
    },
    { enabled: isOpen }
  );

  function closeSettings() {
    delete router.query.song;

    router.replace(router, undefined, { shallow: true });
  }

  function SongSection({
    data,
    text,
  }: {
    data: string | null | undefined;
    text: string;
  }) {
    return !isLoading ? (
      data ? (
        <p className="mt-4 text-center text-lg xl:text-xl">
          {text + " " + data}
        </p>
      ) : (
        <></>
      )
    ) : (
      <SquareSkeleton className="mt-4 h-[25px] w-[300px] max-w-full " />
    );
  }

  const LoadedPage = (
    <>
      <div className="flex flex-col xl:flex-row  xl:items-center xl:justify-center xl:gap-20">
        <div className="flex flex-col items-center gap-5  xl:justify-center">
          {!isLoading ? (
            song?.pictureUrl ? (
              <img
                loading="eager"
                className="w-full max-w-[250px] md:max-w-[300px] xl:max-w-[380px]"
                src={song.pictureUrl}
              />
            ) : (
              <ImageSkeleton className=" h-[250px] w-[250px] md:h-[300px] md:w-[300px] xl:h-[380px] xl:w-[380px]" />
            )
          ) : (
            <SquareSkeleton className="h-[250px]  w-[250px] max-w-full md:h-[300px] md:w-[300px] xl:h-[380px] xl:w-[380px]" />
          )}

          <a
            target="_blank"
            href={song ? song.songUrl : ""}
            className=" text-3xl xl:text-4xl"
          >
            {isLoading ? (
              <SquareSkeleton className="h-[20px] w-[200px] max-w-full" />
            ) : (
              song?.name
            )}
          </a>
        </div>

        <Divider className=" hidden !w-[1px]  xl:block  [&>div]:h-[450px]    [&>div]:border-r-2" />

        <div className="mt-6 flex flex-col items-center  text-neutral-400 xl:my-auto xl:items-start">
          <SongSection data={song?.rating} text="Rating:" />
          <SongSection data={song?.genre} text="Genre:" />
          <SongSection data={song?.artist} text="Artist:" />
          <SongSection data={song?.album} text="Album:" />
          <SongSection data={song?.description} text="" />
        </div>
      </div>

      <div className=" -mb mt-12 flex   gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/${router.query.profileName}/${router.query.playlist}`}>
            {router.query.playlist}
          </Link>
        </div>

        <Divider className=" mx-2    !w-[1px] [&>div]:h-[30px]    [&>div]:border-r-2" />

        <div className="flex items-center gap-3">
          <Link href={`/${router.query.profileName}`}>
            {router.query.profileName}
          </Link>
        </div>
      </div>

      <Dialog.Close asChild>
        <button
          className="  absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
          aria-label="Close"
        >
          X
        </button>
      </Dialog.Close>
    </>
  );

  const ErrorPage = (
    <CustomError
      href={`${router.query.profileName}/${
        router.query.playlist && router.query.playlist[0]
      }`}
      pageName="song"
      backToWhere="playlist"
    />
  );

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root open={isOpen} onOpenChange={closeSettings}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="modal  flex !max-h-[100vh] min-h-[50vh] flex-col pb-8 sm:p-16 sm:pb-12 xl:max-w-[1200px] xl:gap-5   xl:pt-24 ">
          {isError ? ErrorPage : LoadedPage}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Song;
