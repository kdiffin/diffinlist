import Image, { StaticImageData } from "next/image";
import React from "react";
import { LoadingSpinner } from "./Loading";

function Avatar({
  className,
  width_height,
  src,
  loading,
}: {
  className?: string;
  width_height: number;
  src: string | StaticImageData | undefined;
  loading: boolean;
}) {
  return (
    <>
      {!loading ? (
        <Image
          alt="Avatar"
          height={width_height}
          priority
          width={width_height}
          src={src!}
          className={`${className && className} rounded-full`}
        />
      ) : (
        <AvatarSkeleton width_height={width_height.toString()} />
      )}
    </>
  );
}

export function AvatarSkeleton({
  className,
  width_height,
}: {
  className?: string;
  width_height: string;
}) {
  return (
    <>
      <div
        className={`${
          className ? className : ""
        } flex h-[${width_height}px] w-[${width_height}px]  items-center justify-center  rounded-full`}
      >
        {" "}
        <LoadingSpinner />
      </div>
    </>
  );
}

export default Avatar;
