import React from "react";

function Loading({ className }: { className: string }) {
  return (
    <div className={`${className} h-full w-full`}>
      <LoadingSpinner />
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

export function LoadingSpinner() {
  return (
    <div
      className="inline-block h-full max-h-[50px] min-h-[30px] w-full min-w-[30px] max-w-[50px] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

export default Loading;
