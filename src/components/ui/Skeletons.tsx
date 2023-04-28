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
