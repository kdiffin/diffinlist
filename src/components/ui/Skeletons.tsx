export function ImageSkeleton({
  className,
  forWhat,
}: {
  className: string;
  forWhat?: string;
}) {
  return (
    <label
      htmlFor="Picture"
      className={`${className} flex  items-center justify-center rounded-sm border-2 border-dotted border-neutral-700 text-center italic text-neutral-500`}
    >
      No Image {forWhat ? forWhat : ""}
    </label>
  );
}

export function SquareSkeleton({
  className,
  forWhat,
}: {
  className: string;
  forWhat?: string;
}) {
  return (
    <div
      className={`${className} animate-pulse  bg-neutral-700/60 text-transparent`}
    >
      a
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className={` neutral-lowkey-bg  relative flex  animate-pulse flex-col items-center gap-2 p-4
focus-within:bg-neutral-700/50 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
    >
      <div
        className="flex h-[149px] w-[149px] animate-pulse items-center justify-center
             bg-neutral-700/60 italic"
      ></div>
      <div className="text-neutral-800"> placeholder text</div>
    </div>
  );
}
