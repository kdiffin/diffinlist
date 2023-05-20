import React from "react";

function Loading({ className }: { className: string }) {
  return (
    <div className={`${className} h-full w-full`}>
      <LoadingSpinner />
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
