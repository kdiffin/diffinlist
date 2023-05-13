import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Button from "~/components/ui/Button";

const search = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-2 text-center text-4xl ">
      <p className="max-w-screen-sm italic text-neutral-300">
        This page is a work in progress, please return to the home page.
      </p>
      <Button className="text-lg">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
};

export default search;
