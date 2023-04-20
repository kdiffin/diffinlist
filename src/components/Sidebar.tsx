import * as Collapsible from "@radix-ui/react-collapsible";
import {
  MdHome,
  MdLogin,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdSearch,
  MdSettings,
} from "react-icons/md";
import React, { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Avatar from "./Avatar";
import CreatePlaylist from "./CreatePlaylist";

function Sidebar() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  function openCreatePlaylist() {
    router.replace(router.asPath + "?showCreatePlaylist=true", undefined, {
      shallow: true,
    });
  }

  return (
    <>
      <nav
        className="bg-neutral  hidden h-screen w-[12%] min-w-[200px] flex-col items-center bg-neutral-900 py-5 
     sm:flex  "
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-1 text-xl  font-semibold text-gray-300 "
        >
          {Logo} <p className="mb-[3px] ">diffinlist</p>
        </Link>

        <div className="mt-5 w-full border-t border-t-neutral-700 "> </div>

        <div className="  subtle-scrollbar  max-h-[80vh]   w-full overflow-y-scroll px-5  [&>a]:mt-4 ">
          <SidebarItem currentRoute={router.asPath} href="/">
            <MdHome /> <p>Home</p>
          </SidebarItem>

          <SidebarItem currentRoute={router.asPath} href="/search">
            <MdSearch /> <p>Search</p>
          </SidebarItem>

          {user ? (
            <SidebarItem
              currentRoute={router.asPath}
              href={`/${user!.username}`}
            >
              <Avatar
                loading={!isLoaded}
                width_height={22}
                src={user.profileImageUrl}
              />{" "}
              <p>Profile</p>
            </SidebarItem>
          ) : (
            <SidebarItem currentRoute="asdasdkasdkj" href="/">
              <SignInButton>
                <button className=" flex items-center gap-2">
                  {" "}
                  <MdLogin /> Sign in
                </button>
              </SignInButton>
            </SidebarItem>
          )}

          <SidebarItem
            currentRoute={router.asPath}
            href={router.asPath + "?showSettings=true"}
          >
            <MdSettings /> <p>Settings</p>
          </SidebarItem>

          <div className="my-6 w-full  border-t border-t-neutral-800 "> </div>

          <div className="flex w-full  flex-col items-start  ">
            <PlaylistsCollapsible />
          </div>
        </div>

        <div className=" mt-auto  border-t-neutral-400  text-center ">
          <div className="mb-3  w-full border-t border-t-neutral-700 "> </div>
          <input
            type="text"
            placeholder="enter name"
            className="mb-4 w-4/5 border-b border-b-neutral-400 bg-transparent placeholder:text-center placeholder:text-sm placeholder:italic
           placeholder:text-neutral-600 focus:border-b-neutral-200 focus:outline-none"
          />

          <button
            onClick={openCreatePlaylist}
            className="rounded-sm bg-neutral-800 p-1  px-3 text-neutral-400"
          >
            + create playlist
          </button>
        </div>
      </nav>
      <CreatePlaylist />
    </>
  );
}

function SidebarItem({
  href,
  className,
  children,
  currentRoute,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  currentRoute: string;
}) {
  const isActive = currentRoute === href;

  return (
    <Link
      href={href}
      className={` 
      flex w-full
      ${isActive ? "text-neutral-100" : ""} ${className ? className : ""}  
      items-center gap-2  text-lg text-neutral-400   hover:text-neutral-200 `}
    >
      {children}
    </Link>
  );
}

//first step into radix here
//good headless components
function PlaylistsCollapsible() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root open={open} className="w-full" onOpenChange={setOpen}>
      <div
        className={` ${
          open ? "text-neutral-300" : "text-neutral-400"
        } sticky top-0 flex w-full items-center justify-between bg-neutral-900 py-2  text-lg `}
      >
        <p>Playlists</p>
        <Collapsible.Trigger asChild>
          <button className=" ">
            {" "}
            {open ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="mt-4 px-2">
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
        <PlaylistItem name="Playlist One" />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function PlaylistItem({
  name,
  pictureSrc,
}: {
  name: string;
  pictureSrc?: string;
}) {
  return (
    <div className=" text-md mt-3 flex items-center gap-2 break-all  text-neutral-400">
      {pictureSrc ? (
        //convert this to Image
        <img
          src={pictureSrc}
          className="h-6 w-6 rounded-full"
          alt={`${name}'s pic`}
        />
      ) : (
        <div className="h-6 w-6 rounded-full bg-neutral-700"> </div>
      )}
      <p>{name}</p>{" "}
    </div>
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
