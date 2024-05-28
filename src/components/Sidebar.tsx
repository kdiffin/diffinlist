import { SignInButton, useUser } from "@clerk/nextjs";
import { Playlist } from "@prisma/client";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Dialog from "@radix-ui/react-dialog";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import {
  MdHome,
  MdLogin,
  MdMenu,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdSearch,
  MdSettings,
} from "react-icons/md";
import { api } from "~/utils/api";
import defaultProfilePic from "../public/defaultuser.png";
import Avatar from "./ui/Avatar";
import { LoadingSpinner } from "./ui/Loading";
import Image from "next/image";

function Sidebar() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  const { data: playlists, isLoading } = api.playlist.getPlaylists.useQuery({
    profileName: user && user.username ? user.username : "",
    takeLimit: 20,
  });

  function openCreatePlaylist() {
    const url = {
      pathname: router.route,
      query: { ...router.query, showCreatePlaylist: "true" },
    };

    void router.replace(url, undefined, {
      shallow: true,
    });
  }

  //this only applies to mobile logic
  const isOpen = router.query.showSidebar === "true";
  function closeSidebar() {
    delete router.query.showSidebar;
    void router.replace(router, undefined, { shallow: true });
  }

  function openSidebar() {
    const url = {
      pathname: router.route,
      query: {
        ...router.query,
        showSidebar: "true",
      },
    };

    void router.replace(url, undefined, {
      shallow: true,
    });
  }

  return (
    <>
      {/* desktop sidebar */}
      <nav
        className="bg-neutral  hidden h-screen w-[12%] min-w-[200px] flex-col items-center bg-neutral-900 py-5 
     md:flex  "
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-1 text-xl  font-semibold text-gray-300 "
        >
          {Logo} <p className="mb-[3px] ">diffinlist</p>
        </Link>

        <div className="mt-5 w-full border-t border-t-neutral-700 "> </div>

        <div className="  subtle-scrollbar  max-h-[80vh]   w-full overflow-y-scroll px-5  [&>a]:mt-4 ">
          <SidebarItem href="/">
            <MdHome /> <p>Home</p>
          </SidebarItem>

          <SidebarItem href="/search">
            <MdSearch /> <p>Search</p>
          </SidebarItem>

          {user ? (
            <SidebarItem href={`/${user.username ? user.username : ""}`}>
              <Avatar
                loading={!isLoaded}
                width_height={22}
                src={user.profileImageUrl}
              />{" "}
              <p>Profile</p>
            </SidebarItem>
          ) : (
            <SidebarItem href="?">
              <SignInButton>
                <button className=" flex items-center gap-2">
                  {" "}
                  <MdLogin /> Sign in
                </button>
              </SignInButton>
            </SidebarItem>
          )}

          <SidebarItem
            shallow={true}
            href={{
              pathname: router.basePath,
              query: { ...router.query, showSettings: "true" },
            }}
          >
            <MdSettings /> <p>Settings</p>
          </SidebarItem>

          <div className="my-6 w-full  border-t border-t-neutral-800 "> </div>

          <div className="flex w-full  flex-col items-start  ">
            <PlaylistsCollapsible playlists={playlists} isLoading={isLoading} />
          </div>
        </div>

        <div className=" mt-auto  border-t-neutral-400  text-center ">
          <div className=" w-full border-t border-t-neutral-700 "> </div>

          {/* //ok idk why but without the input the ui doesnt look good  */}
          <input
            autoComplete="off"
            disabled={true}
            className="   bg-none opacity-0 "
          />

          <button
            onClick={openCreatePlaylist}
            className="rounded-sm bg-neutral-800 p-2  px-3 text-neutral-400"
          >
            + create playlist
          </button>
        </div>
      </nav>

      {/* mobile navbar */}
      <nav
        className="bg-neutral  flex w-screen items-center  justify-between overflow-x-hidden  bg-neutral-900 p-4 md:hidden 
       "
      >
        <Dialog.Root open={isOpen} onOpenChange={closeSidebar}>
          <button onClick={openSidebar} className="flex items-center gap-2">
            <MdMenu size={24} className="text-neutral-300" />
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-1 text-xl  font-semibold text-gray-300 "
          >
            {Logo} <p className="mb-[3px] ">diffinlist</p>
          </Link>

          <Link
            href={`/${user && user.username ? user.username : router.asPath}`}
          >
            <Avatar
              src={user ? user.profileImageUrl : defaultProfilePic}
              loading={!isLoaded}
              width_height={26}
            />
          </Link>

          {/* open and closable section */}
          {/* decided to be --lazy-- efficent and copy pasted everything */}
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
            <Dialog.Content
              className={`fixed left-0 top-0 flex h-screen   w-64 flex-col   bg-neutral-900  py-6 data-[state=open]:animate-showSidebar`}
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-1 text-xl  font-semibold text-gray-300 "
              >
                {Logo} <p className="mb-[3px] ">diffinlist</p>
              </Link>

              <div className="mt-5 w-full border-t border-t-neutral-700 ">
                {" "}
              </div>

              <div className="  subtle-scrollbar  max-h-[80vh]   w-full overflow-y-scroll px-5  [&>a]:mt-4 ">
                <SidebarItem href="/">
                  <MdHome /> <p>Home</p>
                </SidebarItem>

                <SidebarItem href="search">
                  <MdSearch /> <p>Search</p>
                </SidebarItem>

                {user ? (
                  <SidebarItem href={`/${user.username ? user.username : ""}`}>
                    <Avatar
                      loading={!isLoaded}
                      width_height={22}
                      src={user.profileImageUrl}
                    />{" "}
                    <p>Profile</p>
                  </SidebarItem>
                ) : (
                  <SidebarItem href="?signin">
                    <SignInButton>
                      <button className=" flex items-center gap-2">
                        {" "}
                        <MdLogin /> Sign in
                      </button>
                    </SignInButton>
                  </SidebarItem>
                )}

                <SidebarItem
                  shallow={true}
                  href={{
                    pathname: router.route,
                    query: { ...router.query, showSettings: "true" },
                  }}
                >
                  <MdSettings /> <p>Settings</p>
                </SidebarItem>

                <div className="my-6 w-full  border-t border-t-neutral-800 ">
                  {" "}
                </div>

                <div className="flex w-full  flex-col items-start  ">
                  <PlaylistsCollapsible
                    playlists={playlists}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              <div className=" mt-auto  border-t-neutral-400  text-center ">
                <div className=" w-full border-t border-t-neutral-700 "> </div>

                {/* //ok idk why but without the input the ui doesnt look good  */}
                <input
                  autoComplete="off"
                  disabled={true}
                  className="   bg-none opacity-0 "
                />

                <button
                  onClick={openCreatePlaylist}
                  className="rounded-sm bg-neutral-800 p-2  px-3 text-neutral-400"
                >
                  + create playlist
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </>
  );
}

function SidebarItem({
  href,
  className,
  children,
  shallow,
}: {
  href: Url;
  className?: string;
  children: ReactNode;
  shallow?: boolean;
}) {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <Link
      href={href}
      shallow={shallow}
      className={` 
      flex w-full outline-none outline-neutral-900
      ${isActive ? "!text-neutral-200" : ""} ${className ? className : ""}  
      items-center gap-2  text-lg text-neutral-400   hover:text-neutral-200 `}
    >
      {children}
    </Link>
  );
}

//first step into radix here
//good headless components
function PlaylistsCollapsible({
  playlists,
  isLoading,
}: {
  playlists: Playlist[] | undefined;
  isLoading: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root open={open} className="w-full" onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <div
          className={` ${
            open ? "text-neutral-300" : "text-neutral-400"
          } sticky top-0 flex w-full cursor-pointer items-center justify-between bg-neutral-900 py-2  text-lg `}
        >
          <p>Playlists</p>
          <button className=" ">
            {" "}
            {open ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
          </button>
        </div>
      </Collapsible.Trigger>

      <Collapsible.Content className="mt-4 px-2">
        {/* chaotic if else incoming */}
        {/* if is loading is false, check if playlists and playlists.length is bigger than 0 */}
        {/* if so, then render out the playlists, if playlists.length is 0 say no playlists found */}
        {/* otherwise, if loading then display loading spinner */}

        {!isLoading ? (
          playlists && playlists.length > 0 ? (
            playlists.map((playlist) => {
              const playlistName = encodeURIComponent(playlist.name);

              return (
                <PlaylistItem
                  name={playlist.name}
                  href={`/${playlist.authorName}/${playlistName}`}
                  pictureSrc={playlist.pictureUrl}
                  key={playlist.id}
                />
              );
            })
          ) : (
            <p className="text-neutral-500 ">No playlists found</p>
          )
        ) : (
          <div className="flex h-[70px]   w-full items-center justify-center">
            <LoadingSpinner width_height="w-[30px] h-[30px]" />
          </div>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function PlaylistItem({
  name,
  pictureSrc,
  href,
}: {
  name: string;
  pictureSrc?: string;
  href: string;
}) {
  const router = useRouter();
  const isActive = router.asPath === encodeURI(href);

  return (
    <Link
      href={href}
      className={`${
        isActive ? "!text-neutral-200" : ""
      } text-md mt-3 flex items-center gap-2 break-all  text-neutral-400`}
    >
      {pictureSrc ? (
        //convert this to Image
        <Image
          src={pictureSrc}
          width={24}
          height={24}
          className=" rounded-full"
          alt={`${name}'s pic`}
        />
      ) : (
        <div className="h-6 w-6 rounded-full bg-neutral-700"> </div>
      )}
      <p>{name}</p>{" "}
    </Link>
  );
}

export default Sidebar;

export const Logo = (
  <svg
    className="h-7 w-7 fill-gray-300 "
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="DeblurIcon"
  >
    <path d="M12 3v18c4.97 0 9-4.03 9-9s-4.03-9-9-9z"></path>
    <circle cx="6" cy="14" r="1"></circle>
    <circle cx="6" cy="18" r="1"></circle>
    <circle cx="10" cy="18" r="1"></circle>
    <circle cx="6" cy="10" r="1"></circle>
    <circle cx="3" cy="10" r=".5"></circle>
    <circle cx="6" cy="6" r="1"></circle>
    <circle cx="3" cy="14" r=".5"></circle>
    <circle cx="10" cy="21" r=".5"></circle>
    <circle cx="10" cy="3" r=".5"></circle>
    <circle cx="10" cy="6" r="1"></circle>
    <circle cx="10" cy="14" r="1.5"></circle>
    <circle cx="10" cy="10" r="1.5"></circle>
  </svg>
);
