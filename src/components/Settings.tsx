import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "./Input";
import { api } from "~/utils/api";
import { useClerk, useUser } from "@clerk/nextjs";
import Button from "./Button";
import Avatar, { AvatarSkeleton } from "./Avatar";
import { MdDelete, MdRemove } from "react-icons/md";

function Settings() {
  const router = useRouter();
  //clerk has isLoaded instead of isLoading which is weird
  const { user, isLoaded } = useUser();
  const [profilePicURL, setProfilePicURL] = useState("");
  const [username, setUsername] = useState("");
  const { signOut } = useClerk();

  const isOpen = router.query?.showSettings === "true";

  function closeSettings() {
    delete router.query.showSettings;

    router.push(router);
  }

  function logout() {
    signOut().then(() => closeSettings());
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root open={isOpen} onOpenChange={closeSettings}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[85vw] translate-x-[-50%]  translate-y-[-50%] rounded-sm bg-zinc-900 p-10 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow lg:max-w-[70vw]">
          <Dialog.Title className="  text-2xl font-medium">
            Settings
          </Dialog.Title>

          <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>

          <div className="my-8 flex items-center justify-between ">
            <div className="flex items-center gap-5">
              <>
                <Avatar
                  loading={!isLoaded}
                  width_height={110}
                  src={user?.profileImageUrl}
                />
                <p className="text-4xl">{user?.username}</p>
              </>
            </div>

            <Button className="  text-neutral-500">
              <MdRemove />
            </Button>
          </div>

          <div>
            <fieldset className="mb-6 flex items-center gap-5">
              <label
                className=" w-[90px]  text-right text-[15px]"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                type="text"
                value={username}
                placeholder="Enter new username"
                onChange={setUsername}
              />
            </fieldset>

            <fieldset className="mb-6 flex items-center gap-5">
              <label
                className=" w-[90px] text-right   text-[15px]"
                htmlFor="profile picture"
              >
                Picture
              </label>
              <Input
                type="url"
                value={profilePicURL}
                placeholder="Enter profile picture URL"
                onChange={setProfilePicURL}
                id="profile"
              />
            </fieldset>

            <fieldset className="mb-6 flex items-center gap-5 ">
              <label
                className=" w-[90px] text-right   text-[15px]"
                htmlFor="profile picture"
              >
                Description
              </label>

              <textarea
                placeholder="Enter new description"
                id="username"
                className="max-h-[22vh] w-full bg-zinc-700 p-3 placeholder:text-sm  placeholder:italic focus:bg-zinc-600"
              />
            </fieldset>
          </div>

          <div className="mt-10  flex items-center justify-between">
            <Button onClick={logout}>Sign out</Button>

            <Dialog.Close asChild>
              <Button>Save changes</Button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className=" hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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

export default Settings;
