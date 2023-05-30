import { useUser } from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import { useState } from "react";
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
import Avatar from "~/components/ui/Avatar";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

function search() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [openCardsDropdown, setOpenCardsDropdown] = useState(false);
  const [inputType, setInputType] = useState("name");
  const [cardType, setCardType] = useState("all");

  function CardDropdownButton() {
    if (cardType === "all") {
      return (
        <>
          <MdAllInclusive /> All
        </>
      );
    }

    // if(inputType === "all") {
    //   return <>
    //   <MdAllInclusive /> All

    //   </>

    // }
    return <></>;
  }

  function filterSongs(value: string) {
    const url = {
      pathname: router.route,
      query: { ...router.query, search: value },
    };
    router.replace(url, undefined, { shallow: true });
  }

  return (
    <div className="flex h-full flex-col gap-6 px-8  py-16 text-center sm:px-12 md:px-20 lg:flex-row  lg:justify-between  ">
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
          placeholder={`Name `}
          type="text"
          value={router.query?.name as string}
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
              className="w-24 py-3"
            >
              <CardDropdownButton />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownCards />
        </DropdownMenu.Root>

        <DropdownMenu.Root onOpenChange={() => setOpen(!open)} open={open}>
          <DropdownMenu.Trigger asChild>
            <Button onClick={() => setOpen(!open)} className="w-26 py-3">
              <MdFilterAlt /> Filter
            </Button>
          </DropdownMenu.Trigger>

          <Dropdown />
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

const Dropdown = ({}: {}) => {
  return (
    <DropdownMenu.Content className="dropdown " sideOffset={-15}>
      <DropdownMenu.Item className="dropdown-item group">
        <MdMusicNote /> Name
      </DropdownMenu.Item>

      <DropdownMenu.Item className="dropdown-item group ">
        <MdPerson /> Author's name
      </DropdownMenu.Item>

      <DropdownMenu.Item className="dropdown-item group ">
        <MdHourglassTop /> Latest
      </DropdownMenu.Item>

      <DropdownMenu.Item className="dropdown-item group ">
        <MdHourglassBottom /> Oldest
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

const DropdownCards = ({}: {}) => {
  return (
    <DropdownMenu.Content className="dropdown " sideOffset={-15}>
      <DropdownMenu.Item className="dropdown-item group">
        <MdAllInclusive /> All
      </DropdownMenu.Item>

      <DropdownMenu.Item className="dropdown-item group">
        <MdMusicNote /> Songs
      </DropdownMenu.Item>

      <DropdownMenu.Item className="dropdown-item group ">
        <MdVolumeUp /> Playlists
      </DropdownMenu.Item>

      <DropdownMenu.Item className="dropdown-item group ">
        <MdPerson /> Users
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

export default search;
