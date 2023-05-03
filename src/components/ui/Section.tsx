import Link from "next/link";
import { ReactNode, useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import Loading from "./Loading";
import Image from "next/image";
import { memo } from "react";
import { ImageSkeleton } from "./Skeletons";
import Input from "./Input";
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";

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
      pathname: router.pathname,
      query: { ...router.query, search: value },
    };

    router.replace(url, undefined, { shallow: true });
  }

  return (
    //id is for routing to it
    <div id={name} className="relative">
      <div className=" mb-12 flex flex-col items-center justify-between gap-10 text-center  xl:mb-10  xl:flex-row ">
        <Link className="text-2xl" href={name}>
          {name}
        </Link>

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
          href={`playlists`}
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
  addSong,
}: {
  title: string;
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
    // if it does tho render out the regular card with the lazy loaded and regular img
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
      return pictureUrl === "" ? (
        <>
          <ImageSkeleton className="h-[148px] w-[148px]" />
          <p className="">{title}</p>
        </>
      ) : (
        <>
          <div className="h-[148px] w-[148px]">
            <img
              width={130}
              height={130}
              alt={title + "'s image"}
              loading="lazy"
              className=" h-full  w-full object-cover"
              src={pictureUrl!}
            />
          </div>
          <p className="">{title}</p>
        </>
      );
    }
  }

  return (
    <Link
      href={href && !skeleton ? href : ""}
      shallow={shallow}
      className={`${skeleton && "animate-pulse"} 
        neutral-lowkey-bg  flex flex-col items-center gap-2 p-4 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
    >
      {addSong ? (
        <>
          <div
            className="
            flex  h-[150px] w-[150px]  items-center justify-center  rounded-sm border-2 border-dotted border-neutral-700 text-center text-neutral-400
            "
          >
            <MdAdd size={32} />
          </div>
          <p>{title}</p>
        </>
      ) : (
        <RenderBoolean />
      )}
    </Link>
  );
});
