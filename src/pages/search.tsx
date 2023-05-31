import { useUser } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import { Dispatch, useState } from "react";
import {
  MdAllInclusive,
  MdFilterAlt,
  MdHourglassBottom,
  MdHourglassTop,
  MdMusicNote,
  MdPerson,
  MdSearch,
  MdVolumeUp,
} from "react-icons/md";
import CustomError from "~/components/CustomError";
import { SectionCard } from "~/components/Section";
import Avatar from "~/components/ui/Avatar";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Loading from "~/components/ui/Loading";
import { api } from "~/utils/api";

function search() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [openCardsDropdown, setOpenCardsDropdown] = useState(false);
  const [inputType, setInputType] = useState<InputTypeEnum>("name");
  const [cardType, setCardType] = useState<CardDropdownEnum>("all");
  const { data, isLoading, isError } = api.search.getFilteredItems.useQuery({
    name: router.query.name as string,
    query: router.query,
  });

  function CardDropdownButton() {
    if (cardType === "playlists") {
      return (
        <>
          <MdVolumeUp /> Playlists
        </>
      );
    }

    if (cardType === "songs") {
      return (
        <>
          <MdMusicNote /> Songs
        </>
      );
    }

    if (cardType === "users") {
      return (
        <>
          <MdPerson /> Users
        </>
      );
    }

    return (
      <>
        <MdAllInclusive /> All
      </>
    );
  }

  function LoadingOrErrorOrData() {
    if (data && data.length > 0) {
      return (
        <div className=" mt-10 flex flex-1  flex-wrap justify-center gap-5 ">
          {data.map((item) => {
            return (
              <SectionCard
                addFunction={() => null}
                data={{
                  authorName: item.data.authorName,
                  genre: item.data.genre,
                  playlistName: item.data.playlistName,
                  songName: item.data.songName ? item.data.songName : "",
                  pictureUrl: item.data.pictureUrl,
                }}
                href={item.href}
                key={item.id}
                type={item.type}
              />
            );
          })}
        </div>
      );
    }

    if (isLoading) {
      return (
        <Loading className="flex h-full w-full flex-1 items-center justify-center" />
      );
    }

    if (isError) {
      <CustomError href="a" backToWhere="a" pageName="a" />;
    }

    return (
      <div className="flex flex-1 items-center justify-center text-xl font-semibold text-neutral-500">
        No items found
      </div>
    );
  }

  function filterSongs(value: string) {
    function url() {
      if (inputType === "authorname") {
        return {
          pathname: router.route,
          query: { ...router.query, authorName: value },
        };
      }

      return {
        pathname: router.route,
        query: { ...router.query, name: value },
      };
    }

    router.replace(url(), undefined, { shallow: true });
  }

  const inputValue =
    inputType === "authorname" ? router.query.authorName : router.query.name;

  const inputPlaceholder =
    inputType === "authorname" ? "author's name" : "name";

  return (
    <div className="flex flex-col py-16 sm:px-12 md:px-20 ">
      {/* this is the search params */}
      <div className="flex flex-col gap-6 px-8  text-center lg:flex-row  lg:justify-between  ">
        <div className="mb-2 flex flex-col  items-center gap-8   lg:flex-1 lg:items-start    ">
          {/* i put the avatar here cuz it felt really fkin empty and I felt like I had to put something ther */}
          <div className="flex items-center gap-3">
            <Avatar
              loading={!isLoaded}
              src={user?.profileImageUrl}
              width_height={30}
            />
            <h1 className="mb-1 text-left text-3xl">Search</h1>
          </div>

          <Input
            icon={<MdSearch color=" #A3A3A3" />}
            placeholder={"Search by" + " " + inputPlaceholder}
            type="text"
            value={inputValue as string}
            className=" w-full max-w-xl  !px-6 !py-3 !text-sm    "
            setValue={(value: string) => filterSongs(value)}
          />
        </div>

        <div className="flex flex-row flex-wrap items-center justify-between gap-8 lg:flex-col lg:justify-normal  ">
          <DropdownMenu.Root
            onOpenChange={() => setOpenCardsDropdown(!openCardsDropdown)}
            open={openCardsDropdown}
          >
            <DropdownMenu.Trigger asChild>
              <Button
                onClick={() => setOpenCardsDropdown(!openCardsDropdown)}
                className="w-24 !px-1   py-3"
              >
                <CardDropdownButton />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownCards setValue={setCardType} />
          </DropdownMenu.Root>

          <DropdownMenu.Root onOpenChange={() => setOpen(!open)} open={open}>
            <DropdownMenu.Trigger asChild>
              <Button
                onClick={() => setOpen(!open)}
                className="w-24 !px-0 py-3"
              >
                <MdFilterAlt /> Filters
              </Button>
            </DropdownMenu.Trigger>

            <Dropdown setValue={setInputType} />
          </DropdownMenu.Root>
        </div>
      </div>

      {/* this is where the cards are displayed */}
      <div className=" mt-10 flex flex-1  flex-wrap justify-center gap-5 ">
        <LoadingOrErrorOrData />
      </div>
    </div>
  );
}

const Dropdown = ({
  setValue,
}: {
  setValue: Dispatch<React.SetStateAction<InputTypeEnum>>;
}) => {
  const router = useRouter();
  const nameValue = router.query.name;
  const authorNameValue = router.query.authorName;

  function sortBy(value: string) {
    const url = {
      pathname: router.route,
      query: { ...router.query, sortBy: value },
    };

    router.replace(url, undefined, { shallow: true });
  }

  return (
    <DropdownMenu.Content
      className="dropdown overflow-clip   "
      sideOffset={-15}
    >
      <DropdownMenu.Item
        onSelect={() => setValue("name")}
        className="dropdown-item  group     "
      >
        <div className="flex items-center gap-2">
          <MdMusicNote /> Name
        </div>
        {nameValue && (
          <>
            <span className=" "> | </span>

            <abbr
              title={nameValue as string}
              className="text-ellipsis no-underline"
            >
              {" "}
              {nameValue}{" "}
            </abbr>
          </>
        )}
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onSelect={() => setValue("authorname")}
        className="dropdown-item group "
      >
        <div className="flex items-center gap-2">
          <MdPerson /> Author's name
        </div>
        {authorNameValue && (
          <>
            <span className=" "> | </span>

            <abbr title={authorNameValue as string} className=" no-underline ">
              {" "}
              {authorNameValue}{" "}
            </abbr>
          </>
        )}
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onSelect={() => sortBy("latest")}
        className="dropdown-item group "
      >
        <MdHourglassTop /> Latest
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onSelect={() => sortBy("oldest")}
        className="dropdown-item group "
      >
        <MdHourglassBottom /> Oldest
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

const DropdownCards = ({
  setValue,
}: {
  setValue: Dispatch<React.SetStateAction<CardDropdownEnum>>;
}) => {
  const router = useRouter();

  function changeQueryParams(value: CardDropdownEnum) {
    const url = {
      pathname: router.route,
      query: { ...router.query, results: value },
    };

    setValue(value);

    router.replace(url, undefined, { shallow: true });
  }

  return (
    <DropdownMenu.Content className="dropdown " sideOffset={-15}>
      <DropdownMenu.Item
        onSelect={() => changeQueryParams("all")}
        className="dropdown-item group"
      >
        <MdAllInclusive /> All
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onSelect={() => changeQueryParams("songs")}
        className="dropdown-item group"
      >
        <MdMusicNote /> Songs
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onSelect={() => changeQueryParams("playlists")}
        className="dropdown-item group "
      >
        <MdVolumeUp /> Playlists
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onSelect={() => changeQueryParams("users")}
        className="dropdown-item group "
      >
        <MdPerson /> Users
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

type CardDropdownEnum = "all" | "songs" | "playlists" | "users";
type InputTypeEnum = "name" | "authorname";

export default search;
