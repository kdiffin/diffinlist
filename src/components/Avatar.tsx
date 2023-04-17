import Image from "next/image";
import React from "react";

function Avatar({
  className,
  width_height,
  src,
}: {
  className?: string;
  width_height: number;
  src: string;
}) {
  return (
    <Image
      alt="Avatar"
      height={width_height}
      width={width_height}
      src={src}
      className={`${className ? className : ""} rounded-full`}
    />
  );
}

export default Avatar;
