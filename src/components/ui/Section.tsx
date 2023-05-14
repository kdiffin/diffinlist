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
import Loading from "./Loading";
import Image from "next/image";
import { memo } from "react";
import { ImageSkeleton } from "./Skeletons";
import Input from "./Input";
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";
import Avatar from "./Avatar";
import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { User } from "@clerk/nextjs/dist/api";

// okay I think something like react composition couldve been very useful for this component
// ill try that pattern out later maybe.
// https://www.youtube.com/watch?v=vPRdY87_SH0

export const Section = memo(function Section({
  name,
  children,
  hideShowMore,
  showSearchSong,
  loading,
}: {
  name: string;
  loading: boolean;
  hideShowMore?: boolean;
  showSearchSong?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const skeletonArray: string[] = new Array(8).fill("") as string[];
  const SectionCardSkeleton = skeletonArray.map((abc, index) => {
    return (
      <SectionCard
        skeleton={true}
        type="profile"
        authorName="a"
        username=""
        href={""}
        title={""}
        pictureUrl={""}
        key={index}
      />
    );
  });

  function filterSongs(value: string) {
    //ngl in nextjs working with query params is all over the place
    // keeps old params but adds search
    const url = {
      pathname: router.route,
      query: { ...router.query, search: value },
    };

    router.replace(url, undefined, { shallow: true });
  }

  return (
    //id is for routing to it
    <div id={name} className="relative">
      <div className=" mb-12 flex flex-col items-center justify-between gap-10 text-center  xl:mb-10  xl:flex-row ">
        <p className="text-2xl">{name}</p>

        {showSearchSong ? (
          <Input
            icon={<MdSearch color=" #A3A3A3" />}
            placeholder="Search song"
            type="text"
            value={router.query?.search as string}
            className=" w-full max-w-lg !px-6 !py-3   xl:max-w-md "
            setValue={(value: string) => filterSongs(value)}
          />
        ) : null}
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
});

export const SectionCard = memo(function ({
  title,
  pictureUrl,
  username,
  href,
  authorName,
  shallow,
  skeleton,
  isProfile,
  type,
  addSong,
}: {
  title: string;
  username: string;
  isProfile?: boolean | undefined;
  authorName: string;
  shallow?: boolean;
  skeleton?: boolean;
  pictureUrl: string;
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
      return !pictureUrl ? (
        <>
          <ImageSkeleton className="h-[148px] w-[148px]" />
          <p className="">{title}</p>
        </>
      ) : (
        <>
          <div className="flex h-[148px] w-[148px] items-center justify-center ">
            {isProfile ? (
              <Avatar
                loading={false}
                src={pictureUrl}
                width_height={130}
                className=" object-cover"
              />
            ) : (
              <img
                width={140}
                height={140}
                alt={title + "'s image"}
                loading="lazy"
                className=" h-full  w-full object-cover"
                src={pictureUrl!}
              />
            )}
          </div>
          <p className=" max-h-[23px] max-w-[150px] overflow-clip text-ellipsis">
            {title}
          </p>
        </>
      );
    }
  }

  function openDropdown(e: any) {
    // stops the parent card from redirecting
    e.stopPropagation();
    e.preventDefault();
    console.log(authorName);
  }

  const isAuthor = authorName === username;
  console.log(isAuthor);

  return (
    <DropdownMenu.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Link
            href={!skeleton ? href : ""}
            shallow={shallow}
            className={`${skeleton && " animate-pulse"}
            ${!skeleton ? "card group" : ""}   neutral-lowkey-bg 
        relative  flex flex-col items-center gap-2 p-4
          focus-within:bg-neutral-700/50 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
          >
            {addSong ? (
              <>
                <div
                  className="
            flex   h-[150px] w-[150px]  items-center justify-center  rounded-sm border-2 border-dotted border-neutral-700 text-center text-neutral-400
            "
                >
                  <MdAdd size={32} />
                </div>
                <p>{title}</p>
              </>
            ) : (
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
            )}
          </Link>
          <Dropdown
            isSignedIn={!(username === "")}
            type={type}
            isAuthor={isAuthor}
          />
          <RightClickDropdown
            isSignedIn={!(username === "")}
            type={type}
            isAuthor={isAuthor}
          />
        </ContextMenu.Trigger>
      </ContextMenu.Root>
    </DropdownMenu.Root>
  );
});

// https://www.radix-ui.com/docs/primitives/components/dropdown-menu
// love love love radix ui
// im gonna slowly build my own library using radix ui like shadcn did
// i dont like slate like shadcn.ui has I prefer zinc and neutral
const Dropdown = ({
  type,
  isAuthor,
  isSignedIn,
}: {
  type: "playlist" | "song" | "profile";
  isAuthor: boolean;
  isSignedIn: boolean;
}) => {
  return (
    <DropdownMenu.Content
      onCloseAutoFocus={(e) => e.preventDefault()}
      className="dropdown "
      sideOffset={-15}
    >
      <DropdownMenu.Item className="dropdown-item group ">
        <MdLink size={20} className="text-zinc-500" /> Share {type}
      </DropdownMenu.Item>

      {!(type === "profile") ? (
        <>
          <DropdownMenu.Item
            disabled={!isSignedIn}
            className="dropdown-item group"
          >
            <MdAdd size={20} className="text-zinc-500" /> Add{" "}
            {type === "playlist" ? "playlist to profile" : "song to playlist"}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            disabled={!isAuthor}
            className="dropdown-item group "
          >
            <MdEdit size={20} className="text-zinc-500" /> Edit {type}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            disabled={!isAuthor}
            className="dropdown-item group "
          >
            <MdDelete size={20} className="text-zinc-500" /> Delete {type}
          </DropdownMenu.Item>
        </>
      ) : (
        <></>
      )}
    </DropdownMenu.Content>
  );
};

// the dropdown for when the user right clicks or is a mobile user and long presses
// https://www.radix-ui.com/docs/primitives/components/context-menu
// copy pasted the same thing from dropdown
const RightClickDropdown = ({
  type,
  isAuthor,
  isSignedIn,
}: {
  type: "playlist" | "song" | "profile";
  isAuthor: boolean;
  isSignedIn: boolean;
}) => {
  return (
    <ContextMenu.Content
      className="dropdown "
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <ContextMenu.Item className="dropdown-item group ">
        <MdLink size={20} className="text-zinc-500" /> Share {type}
      </ContextMenu.Item>

      {!(type === "profile") ? (
        <>
          <ContextMenu.Item
            disabled={!isSignedIn}
            className="dropdown-item group"
          >
            <MdAdd size={20} className="text-zinc-500" /> Add{" "}
            {type === "playlist" ? "playlist to profile" : "song to playlist"}
          </ContextMenu.Item>
          <ContextMenu.Item
            disabled={!isAuthor}
            className="dropdown-item group "
          >
            <MdEdit size={20} className="text-zinc-500" /> Edit {type}
          </ContextMenu.Item>
          <ContextMenu.Item
            disabled={!isAuthor}
            className="dropdown-item group "
          >
            <MdDelete size={20} className="text-zinc-500" /> Delete {type}
          </ContextMenu.Item>
        </>
      ) : (
        <></>
      )}
    </ContextMenu.Content>
  );
};
