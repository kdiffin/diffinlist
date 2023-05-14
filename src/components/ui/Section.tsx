import Link from "next/link";
import { MouseEvent, ReactNode, useRef, useState } from "react";
import { MdAdd, MdMoreHoriz, MdSearch } from "react-icons/md";
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
  href,
  shallow,
  skeleton,
  avatar,
  addSong,
}: {
  title: string;
  avatar?: boolean | undefined;
  shallow?: boolean;
  skeleton?: boolean;
  pictureUrl: string;
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
            {avatar ? (
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
  }

  return (
    <DropdownMenu.Root>
      <Link
        href={!skeleton ? href : ""}
        shallow={shallow}
        className={`${skeleton && "animate-pulse"} card neutral-lowkey-bg group
        relative  flex flex-col items-center gap-2 p-4 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
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
          <div className="    flex flex-col items-center  gap-3 py-1">
            <RenderBoolean />

            <DropdownMenu.Trigger
              asChild
              className="focus:outline-transparent focus-visible:outline-transparent"
            >
              <button
                onClick={(e) => openDropdown(e)}
                tabIndex={0}
                className="dropdown-button absolute -right-2 -top-4 hidden p-3 outline-none transition hover:scale-[1.20]  focus:block focus:scale-[1.20] focus:outline-transparent focus-visible:block focus-visible:outline-transparent  active:scale-100 group-hover:block   group-focus-visible:block"
              >
                <MdMoreHoriz size={26} />
              </button>
            </DropdownMenu.Trigger>
          </div>
        )}
      </Link>
      <Dropdown />
    </DropdownMenu.Root>
  );
});

const Dropdown = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  return (
    <DropdownMenu.Content
      className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade 
      data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-20
       min-w-[220px]  rounded-md bg-zinc-800
       p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
      sideOffset={5}
    >
      <DropdownMenu.Item className=" data-[highlighted]:bg- data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
        New Tab{" "}
        <div className="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white">
          ⌘+T
        </div>
      </DropdownMenu.Item>
      <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none">
        New Window{" "}
        <div className="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white">
          ⌘+N
        </div>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
        disabled
      >
        New Private Window{" "}
        <div className="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white">
          ⇧+⌘+N
        </div>
      </DropdownMenu.Item>

      <DropdownMenu.Separator className="m-[5px] h-[1px] bg-white" />

      <DropdownMenu.CheckboxItem
        className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
        checked={bookmarksChecked}
        onCheckedChange={setBookmarksChecked}
      >
        <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center"></DropdownMenu.ItemIndicator>
        Show Bookmarks{" "}
        <div className="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white">
          ⌘+B
        </div>
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.CheckboxItem
        className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
        checked={urlsChecked}
        onCheckedChange={setUrlsChecked}
      >
        <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center"></DropdownMenu.ItemIndicator>
        Show Full URLs
      </DropdownMenu.CheckboxItem>

      <DropdownMenu.Separator className="bg-violet6 m-[5px] h-[1px]" />

      <DropdownMenu.Label className="text-mauve11 pl-[25px] text-xs leading-[25px]">
        People
      </DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
        <DropdownMenu.RadioItem
          className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
          value="pedro"
        >
          <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center"></DropdownMenu.ItemIndicator>
          Pedro Duarte
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem
          className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
          value="colm"
        >
          <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center"></DropdownMenu.ItemIndicator>
          Colm Tuite
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  );
};
