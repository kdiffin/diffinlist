import Link from "next/link";
import React from "react";
import Button from "./ui/Button";

function CustomError({
  href,
  pageName,
  backToWhere,
}: {
  href: string;
  pageName: string;
  backToWhere: string;
}) {
  return (
    <div className="flex h-full flex-1  flex-col items-center justify-center gap-10 text-4xl">
      <p className="font-medium">Couldn't find {pageName}</p>
      <Link href={`/${href}`}>
        <Button className="text-lg">Go back to {backToWhere}</Button>
      </Link>
    </div>
  );
}

export default CustomError;
