import Link from "next/link";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";
import Loading from "./Loading";
import Image from "next/image";
import { memo } from "react";

export const Section = memo(function Section({
  name,
  children,
  loading,
}: {
  name: string;
  loading: boolean;
  children: ReactNode;
}) {
  const skeletonArray: string[] = new Array(8).fill("") as string[];
  const SectionCardSkeleton = skeletonArray.map((abc, index) => {
    return (
      <SectionCard
        skeleton={true}
        href={null}
        title={null}
        pictureUrl={null}
        key={index}
      />
    );
  });

  return (
    //id is for routing to it
    <div id={name}>
      <div className="mb-12 text-center text-xl  xl:mb-10 xl:text-left">
        <Link href={name}>{name}</Link>
      </div>

      <div className="flex flex-wrap justify-center  gap-5 overflow-hidden xl:justify-normal ">
        {loading ? SectionCardSkeleton : children}
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
});

export function SectionCard({
  title,
  pictureUrl,
  href,
  skeleton,
}: {
  title: string | null;
  skeleton?: boolean;
  pictureUrl: string | null;
  href: string | null;
}) {
  function RenderBoolean() {
    if (skeleton) {
      return (
        <>
          <div className="flex h-[150px] w-[150px] animate-pulse items-center justify-center bg-neutral-700/60 italic"></div>
          <div className="text-neutral-800"> placeholder text</div>
        </>
      );
    } else {
      return pictureUrl === "" ? (
        <>
          <p className="flex h-[150px]  w-[150px] items-center justify-center italic text-neutral-500">
            No image for playlist
          </p>
          <p className="">{title}</p>
        </>
      ) : (
        <>
          <Image
            alt={title + "'s image"}
            width={150}
            height={150}
            src={pictureUrl!}
          />
          <p className="">{title}</p>
        </>
      );
    }
  }

  return (
    <Link
      href={"/playlists/" + href}
      className={`${
        skeleton ? "animate-pulse" : ""
      } neutral-lowkey-bg flex  flex-col items-center gap-2 p-4 hover:bg-neutral-700/30`}
    >
      <RenderBoolean />

      {/* <p>{createdAt} • {</p> */}
    </Link>
  );
}
