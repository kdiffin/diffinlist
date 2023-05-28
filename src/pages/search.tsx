import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { MdSearch } from "react-icons/md";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

const search = () => {
  const router = useRouter();

  function filterSongs(value: string) {
    const url = {
      pathname: router.route,
      query: { ...router.query, search: value },
    };
    router.replace(url, undefined, { shallow: true });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-2 text-center text-4xl ">
      <div>
        <Input
          icon={<MdSearch color=" #A3A3A3" />}
          placeholder="Search song"
          type="text"
          value={router.query?.name as string}
          className=" w-full max-w-lg !px-6 !py-3 !text-sm   xl:max-w-md "
          setValue={(value: string) => filterSongs(value)}
        />
      </div>

      <Button className="text-lg">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
};

export default search;
