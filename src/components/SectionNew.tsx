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
import { SectionCard } from "./Section";
import { UserClient } from "~/server/api/routers/profile";

// okay I think something like react composition couldve been very useful for this component
// ill try that pattern out later maybe.
// https://www.youtube.com/watch?v=vPRdY87_SH0

export const Section = memo(function Section({
  name,
  children,
  hideShowMore,
  showSearchSong,
  sectionArray,
  loading,
}: {
  name: string;
  loading: boolean;
  sectionArray: Song[] | UserClient[] | Playlist[];
  hideShowMore?: boolean;
  showSearchSong?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();

  const skeletonArray: string[] = new Array(8).fill("") as string[];
  const SectionCardSkeleton = skeletonArray.map((abc, index) => {
    return (
      <SectionCard
        data={undefined}
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

  const SectionPosts = sectionArray.map((sectionItem, index) => {
    <SectionCard
      data={sectionItem}
      skeleton={true}
      type="profile"
      authorName="a"
      username=""
      href={""}
      title={""}
      pictureUrl={""}
      // @ts-ignore
      key={sectionItem.id || index}
    />;
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
