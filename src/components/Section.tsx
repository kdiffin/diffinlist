import Link from "next/link";
import { ReactNode } from "react";
import { MdAdd, MdDelete, MdEdit, MdLink, MdMoreHoriz } from "react-icons/md";
import { memo } from "react";
import { ImageSkeleton, SkeletonCard } from "./ui/Skeletons";
import { Url } from "next/dist/shared/lib/router/router";
import Avatar from "./ui/Avatar";
import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ContextMenu from "@radix-ui/react-context-menu";
import useCardDropdown from "~/hooks/useCardDropdown";
import useDelete from "~/hooks/useDelete";

// im making the code more wet but wayyyy more readable and understandable with this commit
// having way too many conditionals and ternaries just suck and making the code SLIGHTLY non DRY,
// but way more modular is a good comprimise.

export function Section({
  title,
  children,
  hideShowMore,
  loading,
  showMoreHref,
}: {
  title: ReactNode;
  loading: boolean;
  showMoreHref?: string;
  hideShowMore?: boolean;
  children: ReactNode;
}) {
  const skeletonArray: string[] = new Array(8).fill("") as string[];
  const SectionCardSkeleton = skeletonArray.map((abc, index) => {
    return <SkeletonCard key={index} />;
  });

  return (
    <div className="relative">
      <div className=" mb-12 flex flex-col items-center justify-between gap-10 text-center text-2xl  xl:mb-10  xl:flex-row ">
        {title}
      </div>

      <div className="flex flex-wrap justify-center  gap-5 overflow-hidden xl:justify-normal ">
        {loading ? SectionCardSkeleton : children}
      </div>

      {!hideShowMore && (
        <div
          className="mt-12 flex  justify-center
           gap-2 font-semibold  text-neutral-600 "
        >
          <Link
            href={showMoreHref ? showMoreHref : ""}
            className="flex max-w-prose items-center gap-1 text-center"
          >
            Show more <MdAdd className="mt-1 " />
          </Link>
        </div>
      )}
    </div>
  );
}

// moved the delete function up to the parent component. Noticing a trend of moving stuff to
// the parent becoming the norm here, this will aid me with typesafety and not make the child components
// bloated with a bunch of tsignores and conditionals.
function SectionCardNoMemo({
  href,
  shallow,
  data,
  addFunction,
  isAuthor,
  isSignedIn,
  type,
}: {
  shallow?: boolean;
  isAuthor: boolean;
  isSignedIn: boolean;
  addFunction: (playlistName: string) => void;
  data: CardValues;
  type: "playlist" | "song" | "profile";
  href: Url;
}) {
  const title = data.songName ? data.songName : data.playlistName;
  function ImageChecker() {
    if (!data.pictureUrl) {
      return (
        <>
          <ImageSkeleton className="h-[148px] w-[148px]" />
          <p>{title}</p>
        </>
      );
    }

    return (
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
              alt={title + "'s image"}
              loading="lazy"
              className=" h-full  w-full object-cover"
              src={data.pictureUrl!}
            />
          )}
        </div>
        <p className=" max-h-[23px] max-w-[150px] overflow-clip text-ellipsis">
          {title}
        </p>
      </>
    );
  }

  const { playlistDelete, songDelete } = useDelete();
  function deleteFunction() {
    if (type === "playlist") {
      playlistDelete({
        playlistName: data.playlistName,
      });

      return;
    }

    songDelete({
      name: data.songName!,
      playlistName: data.playlistName,
    });
  }

  function openDropdown(e: any) {
    // stops the parent card from redirecting
    e.stopPropagation();
    e.preventDefault();
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
        {/* the whole button is the trigger for the rightclick/hold down dropdown */}
        <ContextMenu.Trigger>
          <Link
            href={href}
            shallow={shallow}
            className={`
             card neutral-lowkey-bg group  relative  flex flex-col items-center gap-2 p-4
          focus-within:bg-neutral-700/50 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
          >
            <div className="flex flex-col items-center  gap-3 pt-1">
              <ImageChecker />

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

          <Dropdown
            addFunction={addFunction}
            deleteFunction={deleteFunction}
            ShareLink={linkHref}
            isSignedIn={isSignedIn}
            isAuthor={isAuthor}
            type={type}
          />

          <RightClickDropdown
            addFunction={addFunction}
            deleteFunction={deleteFunction}
            ShareLink={linkHref}
            isSignedIn={isSignedIn}
            isAuthor={isAuthor}
            type={type}
          />
        </ContextMenu.Trigger>
      </ContextMenu.Root>
    </DropdownMenu.Root>
  );
}

export const SectionCard = memo(SectionCardNoMemo);

const Dropdown = ({
  type,
  isAuthor,
  ShareLink,
  isSignedIn,
  deleteFunction,
  addFunction,
}: {
  type: "playlist" | "song" | "profile";
  ShareLink: string;
  isAuthor: boolean;
  isSignedIn: boolean;
  deleteFunction: VoidFunction;
  addFunction: (playlistName: string) => void;
}) => {
  const { deleteItem, handleCopy, textRef, addItem, editItem } =
    useCardDropdown({
      type: type,
      deleteFunction: deleteFunction,
      addFunction: addFunction,
    });

  return (
    <DropdownMenu.Content
      onCloseAutoFocus={(e) => e.preventDefault()}
      className="dropdown "
      sideOffset={-15}
    >
      <DropdownMenu.Item onSelect={handleCopy} className="dropdown-item group ">
        <input
          readOnly
          type="text"
          hidden
          ref={textRef}
          value={ShareLink.toString()}
        />
        <MdLink size={20} className="text-zinc-500" /> Share {type}
      </DropdownMenu.Item>

      {!(type === "profile") ? (
        <>
          <DropdownMenu.Item
            disabled={!isSignedIn}
            className="dropdown-item group"
            onSelect={addItem}
          >
            <MdAdd size={20} className="text-zinc-500" /> Add{" "}
            {type === "playlist" ? "playlist to profile" : "song to playlist"}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            disabled={!isAuthor}
            className="dropdown-item group "
            onSelect={editItem}
          >
            <MdEdit size={20} className="text-zinc-500" /> Edit {type}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={deleteItem}
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
  ShareLink,
  deleteFunction,
  addFunction,
}: {
  type: "playlist" | "song" | "profile";
  isAuthor: boolean;
  ShareLink: Url;
  isSignedIn: boolean;
  deleteFunction: VoidFunction;
  addFunction: (playlistName: string) => void;
}) => {
  const { deleteItem, handleCopy, textRef, addItem, editItem } =
    useCardDropdown({
      type: type,
      deleteFunction: deleteFunction,
      addFunction: addFunction,
    });

  return (
    <ContextMenu.Content
      className="dropdown "
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <ContextMenu.Item onSelect={handleCopy} className="dropdown-item group ">
        <MdLink size={20} className="text-zinc-500" /> Share {type}
        <input
          readOnly
          type="text"
          hidden
          ref={textRef}
          value={ShareLink.toString()}
        />
      </ContextMenu.Item>

      {!(type === "profile") ? (
        <>
          <ContextMenu.Item
            disabled={!isSignedIn}
            onSelect={addItem}
            className="dropdown-item group"
          >
            <MdAdd size={20} className="text-zinc-500" /> Add{" "}
            {type === "playlist" ? "playlist to profile" : "song to playlist"}
          </ContextMenu.Item>

          <ContextMenu.Item
            disabled={!isAuthor}
            className="dropdown-item group "
            onSelect={editItem}
          >
            <MdEdit size={20} className="text-zinc-500" /> Edit {type}
          </ContextMenu.Item>

          <ContextMenu.Item
            onSelect={deleteItem}
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

interface CardValues {
  songName?: string;
  playlistName: string;
  genre: string;
  pictureUrl: string;
  authorName: string;
}
