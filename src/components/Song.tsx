import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "./ui/Input";
import { api } from "~/utils/api";
import { useClerk, useUser } from "@clerk/nextjs";
import Button from "./ui/Button";
import Avatar, { AvatarSkeleton } from "./ui/Avatar";
import { MdDelete, MdRemove } from "react-icons/md";
import Divider from "./ui/Divider";

function Song() {
  const router = useRouter();
  //clerk has isLoaded instead of isLoading which is weird
  const [profilePicURL, setProfilePicURL] = useState("");
  const [username, setUsername] = useState("");
  const { user, isLoaded } = useUser();
  const isOpen = Boolean(router.query?.song);

  function closeSettings() {
    delete router.query.song;

    router.replace(router, undefined, { shallow: true });
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root open={isOpen} onOpenChange={closeSettings}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="modal flex !max-h-[100vh] flex-col pb-8 sm:p-16 sm:pb-12 xl:max-w-[1200px] xl:gap-5   xl:pt-24 ">
          <div className="flex flex-col xl:flex-row  xl:items-center xl:justify-center xl:gap-20">
            <div className="flex flex-col items-center gap-5  xl:justify-center">
              <img
                loading="lazy"
                className="w-full max-w-[250px] md:max-w-[300px] xl:max-w-[380px]"
                src={
                  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.ntslive.co.uk%2Fcrop%2F535x535%2F28ce04dd-0a03-4c4f-bf87-c8aa1d433e70_1510617600.png&f=1&nofb=1&ipt=827444f2c0bb77e1feee02fc890db963e69e809fb9558046fc8e4f35f3627314&ipo=images"
                }
              />
              <p className=" text-3xl xl:text-4xl">Flesh over finite</p>
            </div>

            <Divider className=" hidden !w-[1px]  xl:block  [&>div]:h-[450px]    [&>div]:border-r-2" />

            <div className="mt-6 flex flex-col items-center gap-4 text-neutral-400 xl:my-auto xl:items-start">
              <p className="text-lg xl:text-xl  ">Rating: 9.5/10</p>
              <p className="text-lg xl:text-xl  ">Genre: Death metal</p>

              <p className="text-lg xl:text-xl  ">Sub-genre: Tech death</p>
              <p className="text-lg xl:text-xl  ">Artist: Equipose</p>
              <p className="text-lg xl:text-xl  ">Album name: Demiurgus</p>
              <p className="text-lg xl:text-xl  ">
                Description: batshit insane solo at 2:00{" "}
              </p>
            </div>
          </div>

          <div className=" -mb mt-12 flex   gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                width_height={28}
                loading={!isLoaded}
                src={user?.profileImageUrl}
              />
              <p>diffim</p>
            </div>

            <Divider className=" mx-2    !w-[1px] [&>div]:h-[30px]    [&>div]:border-r-2" />

            <div className="flex items-center gap-3">
              <img
                width={28}
                height={28}
                loading="lazy"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.ntslive.co.uk%2Fcrop%2F535x535%2F28ce04dd-0a03-4c4f-bf87-c8aa1d433e70_1510617600.png&f=1&nofb=1&ipt=827444f2c0bb77e1feee02fc890db963e69e809fb9558046fc8e4f35f3627314&ipo=images"
              />
              <p>trap playlist</p>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="  absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Song;
