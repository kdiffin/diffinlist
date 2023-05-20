import Link from "next/link";
import { MouseEvent, ReactNode, useRef, useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdLink,
  MdMoreHoriz,
  MdSearch,
  MdShare,
} from "react-icons/md";
import Loading from "./ui/Loading";
import Image from "next/image";
import { memo } from "react";
import { ImageSkeleton } from "./ui/Skeletons";
import Input from "./ui/Input";
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";
import Avatar from "./ui/Avatar";
import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { User } from "@clerk/nextjs/dist/api";
import { toast } from "react-hot-toast";
import { deleteParamsAtom, showDeleteAtom } from "~/state/atoms";
import { useAtom } from "jotai";
import useCardDropdown from "~/hooks/useCardDropdown";
import { type } from "os";
import { Playlist, Song } from "@prisma/client";
import { UserClient } from "~/server/api/routers/profile";
import { Dropdown, RightClickDropdown } from "./Section";

//this isnt used this is for testing purposes

// okay I think something like react composition couldve been very useful for this component
// ill try that pattern out later maybe.
// https://www.youtube.com/watch?v=vPRdY87_SH0

export function SectionNew({
  name,
  children,
  hideShowMore,
  loading,
  showMoreHref,
}: {
  name: string;
  loading: boolean;
  showMoreHref?: string;
  hideShowMore?: boolean;
  children: ReactNode;
}) {
  const skeletonArray: string[] = new Array(8).fill("") as string[];
  const SectionCardSkeleton = skeletonArray.map((abc, index) => {
    return (
      <SectionCardNew
        isAuthor={false}
        isSignedIn={false}
        skeleton={true}
        type="profile"
        data={{
          pictureUrl: "",
          title: "",
        }}
        href={""}
        key={index}
      />
    );
  });

  // const SectionPosts = sectionArray.map((sectionItem, index) => {
  //   <SectionCard
  //     data={sectionItem}
  //     skeleton={true}
  //     type="profile"
  //     authorName="a"
  //     username=""
  //     href={""}
  //     title={""}
  //     // @ts-ignore
  //     key={sectionItem.id || index}
  //   />;
  // });

  return (
    //id is for routing to it
    <div id={name} className="relative">
      <div className=" mb-12 flex flex-col items-center justify-between gap-10 text-center  xl:mb-10  xl:flex-row ">
        <p className="text-2xl">{name}</p>
      </div>

      <div className="flex flex-wrap justify-center  gap-5 overflow-hidden xl:justify-normal ">
        {loading ? SectionCardSkeleton : children}
      </div>

      {!hideShowMore && (
        <Link
          href={``}
          className="mt-12 flex w-full items-center justify-center
           gap-2 text-center  font-semibold  text-neutral-600 "
        >
          Show more <MdAdd className="mt-1 " />
        </Link>
      )}
    </div>
  );
}

export const SectionCardNew = memo(function ({
  href,
  shallow,
  skeleton,
  data,
  isAuthor,
  isSignedIn,
  type,
}: {
  shallow?: boolean;
  data: SectionCardData;
  isAuthor: boolean;
  isSignedIn: boolean;
  skeleton?: boolean;
  type: "playlist" | "song" | "profile";
  href: Url;
  addSong?: boolean;
}) {
  function RenderBoolean() {
    // lots of crazy if statements in this project
    // if skeleton prop is passed then render the skeleton of the card
    // if not, then see if the picture has a valid URL, if not, then render out the no image for playlist,
    // if it does, check if its an avatar and if it is render out the avatar component
    // if it doesnt tho render out the regular card with the lazy loaded and regular img
    // if anybody knows how to use Image while not knowing the sources of ur images ahead of time let me know

    if (skeleton) {
      return (
        <>
          <div
            className="flex h-[149px] w-[149px] animate-pulse items-center justify-center
             bg-neutral-700/60 italic"
          ></div>
          <div className="text-neutral-800"> placeholder text</div>
        </>
      );
    } else {
      return !data.pictureUrl ? (
        <>
          <ImageSkeleton className="h-[148px] w-[148px]" />
          <p className="">{data.title}</p>
        </>
      ) : (
        <>
          <div className="flex h-[148px] w-[148px] items-center justify-center ">
            {type === "profile" ? (
              <Avatar
                loading={false}
                src={data.pictureUrl}
                width_height={130}
                className=" object-cover"
              />
            ) : (
              <img
                width={140}
                height={140}
                alt={data.title + "'s image"}
                loading="lazy"
                className=" h-full  w-full object-cover"
                src={data.pictureUrl!}
              />
            )}
          </div>
          <p className=" max-h-[23px] max-w-[150px] overflow-clip text-ellipsis">
            {data.title}
          </p>
        </>
      );
    }
  }

  function openDropdown(e: any) {
    // stops the parent card from redirecting
    e.stopPropagation();
    e.preventDefault();
  }

  const songName = type === "song" ? data.title : undefined;

  let playlistName = "";

  if (type === "playlist") {
    playlistName = data.title;
  } else if (type === "song") {
    // @ts-ignore
    data && data.playlistName
      ? // @ts-ignore
        (playlistName = data.playlistName)
      : (playlistName = "");
  } else {
    playlistName = "";
  }

  //check my previous commits i tried doing it with linkref.href but it didnt work bc of hydration errors
  const unEncodedHref =
    typeof href === "object" && typeof href.query === "object"
      ? `https://diffinlist.vercel.app/${href?.query!
          .profileName!}/${href?.query!.playlist!}?song=${href?.query!.song!} `
      : `https://diffinlist.vercel.app${href}`;

  const linkHref = encodeURI(unEncodedHref);

  return (
    <DropdownMenu.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Link
            href={href}
            shallow={shallow}
            className={`${skeleton && " animate-pulse"}
            ${!skeleton ? "card group" : ""}   neutral-lowkey-bg 
             relative  flex flex-col items-center gap-2 p-4
          focus-within:bg-neutral-700/50 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
          >
            <div className="    flex flex-col items-center  gap-3 pt-1">
              <RenderBoolean />

              <DropdownMenu.Trigger asChild>
                <button
                  onClick={(e) => openDropdown(e)}
                  tabIndex={0}
                  className="dropdown-button absolute -right-2 -top-4 p-3  opacity-0  transition hover:scale-[1.20] focus:scale-[1.20]  active:scale-100 group-focus-within:opacity-100  group-hover:opacity-100  group-focus:opacity-100"
                >
                  <MdMoreHoriz size={26} />
                </button>
              </DropdownMenu.Trigger>
            </div>
          </Link>

          {!skeleton && (
            <>
              <Dropdown
                ShareLink={linkHref.toString()}
                playlistName={playlistName}
                songName={songName}
                isSignedIn={isSignedIn}
                type={type}
                isAuthor={isAuthor}
              />
              <RightClickDropdown
                ShareLink={linkHref.toString()}
                playlistName={playlistName}
                songName={songName}
                isSignedIn={isSignedIn}
                type={type}
                isAuthor={isAuthor}
              />
            </>
          )}
        </ContextMenu.Trigger>
      </ContextMenu.Root>
    </DropdownMenu.Root>
  );
});

interface SectionCardData {
  pictureUrl: string;
  title: string;
}
