import React from "react";

function Loading({ className }: { className: string }) {
  return (
    <div className={`${className} h-full w-full`}>
      <LoadingSpinner />
    </div>
  );
}

export function LoadingSpinner({ width_height }: { width_height?: string }) {
  return (
    <div
      className={
        `${width_height ? width_height : ""} ` +
        " " +
        "inline-block h-full max-h-[50px] min-h-[20px] w-full min-w-[20px] max-w-[50px] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      }
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

export default Loading;
