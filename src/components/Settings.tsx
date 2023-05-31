import { useClerk, useUser } from "@clerk/nextjs";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { useState } from "react";
import Avatar from "./ui/Avatar";

import Button from "./ui/Button";

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

    router.replace(router, undefined, { shallow: true });
  }

  function logout() {
    signOut().then(() => closeSettings());
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root open={isOpen} onOpenChange={closeSettings}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="modal !max-w-lg ">
          <Dialog.Title className="  text-2xl font-medium">
            Settings
          </Dialog.Title>

          <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
            Only reason this is here is to sign out for now.
          </Dialog.Description>

          <div className="my-8 flex items-center  justify-between ">
            <div className="my-5 flex items-center gap-5">
              <Avatar
                loading={!isLoaded}
                width_height={110}
                src={user ? user.profileImageUrl : ""}
              />
              <p className="text-4xl">{user?.username}</p>
            </div>
          </div>

          <div className="mt-10  flex items-center justify-between">
            <Button onClick={logout}>Sign out</Button>

            <Dialog.Close asChild>
              <Button>Cancel</Button>
            </Dialog.Close>
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

export default Settings;
