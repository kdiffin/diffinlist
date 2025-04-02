import { StaticImageData } from "next/image";
import { LoadingSpinner } from "./Loading";
//it wouldnt let me import from public

function Avatar({
  className,
  width_height,
  src,
  loading,
}: {
  className?: string;
  width_height: number;
  src: string;
  loading: boolean;
}) {
  return (
    <>
      {!loading ? (
        <img
          alt="Avatar"
          height={width_height}
          width={width_height}
          src={src}
          className={`${className ? className : ""} rounded-full`}
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
