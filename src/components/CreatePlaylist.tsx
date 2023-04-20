import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "./Input";
import { api } from "~/utils/api";
import { useClerk, useUser } from "@clerk/nextjs";
import Button from "./Button";
import Avatar, { AvatarSkeleton } from "./Avatar";
import { MdDelete, MdRemove } from "react-icons/md";
import Image from "next/image";
import { spawn } from "child_process";

//basically a copy paste of the settings feature

function CreatePlaylist() {
  const router = useRouter();
  const [playlistPicUrl, setPlaylistPicUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [name, setName] = useState("");

  const isOpen = router.query?.showCreatePlaylist === "true";

  function closeCreatePlaylist() {
    delete router.query?.showCreatePlaylist;

    router.push(router);
  }

  function removeChanges() {
    setGenre("");
    setName("");
    setPlaylistPicUrl("");
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root open={isOpen} onOpenChange={closeCreatePlaylist}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[85vw] translate-x-[-50%]  translate-y-[-50%] rounded-sm bg-zinc-900 p-10 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow lg:max-w-[70vw]">
          <Dialog.Title className="  text-2xl font-medium">
            Create playlist
          </Dialog.Title>

          <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
            Create a playlist here. Click add playlist when you're done.
          </Dialog.Description>

          <div className="my-10 flex items-center justify-between ">
            <div className="flex items-center gap-5">
              <>
                {playlistPicUrl ? (
                  <img
                    alt="Playlist Image"
                    src={playlistPicUrl}
                    width={130}
                    className="rounded-sm bg-cover "
                    height={130}
                  />
                ) : (
                  <div className="flex h-[130px] w-[130px] items-center justify-center rounded-sm border-2 border-dotted border-neutral-700 text-center italic text-neutral-500">
                    No Image
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <label
                    tabIndex={0}
                    htmlFor="name"
                    className=" cursor-text text-4xl"
                  >
                    {name ? (
                      name
                    ) : (
                      <label
                        htmlFor="name"
                        className="cursor-text text-2xl italic text-neutral-500 "
                      >
                        enter in name
                      </label>
                    )}
                  </label>

                  <label
                    tabIndex={0}
                    htmlFor="name"
                    className=" cursor-text   text-neutral-500"
                  >
                    {genre ? (
                      <p className="">Aesthetic / genre: {genre}</p>
                    ) : (
                      <label
                        htmlFor="name"
                        className="cursor-text italic text-neutral-500 "
                      >
                        enter in name
                      </label>
                    )}
                  </label>
                </div>
              </>
            </div>

            <Button
              onClick={removeChanges}
              className=" px-4  text-sm   text-neutral-500"
            >
              Remove changes
            </Button>
          </div>

          <div>
            <fieldset className="mb-6 flex items-center gap-5">
              <label
                className=" w-[90px]  text-right text-[15px]"
                htmlFor="name"
              >
                Name
              </label>
              <Input
                type="text"
                name="name "
                id="name"
                value={name}
                placeholder="Enter new name"
                onChange={setName}
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
                value={playlistPicUrl}
                placeholder="Enter playlist picture URL"
                onChange={setPlaylistPicUrl}
                id="profile picture"
              />
            </fieldset>

            <fieldset className="mb-6 flex items-center gap-5 ">
              <label
                className=" text-wrap w-[90px]  text-right   text-[15px]"
                htmlFor="genre"
              >
                Aesthetic / Genre
              </label>

              <Input
                type="text"
                value={genre}
                placeholder="Enter the genre of your playlist"
                onChange={setGenre}
                id="genre"
              />
            </fieldset>
          </div>

          <div className="mt-10  flex items-center justify-between">
            <Dialog.Close asChild>
              <Button>+ Add playlist</Button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className=" hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] 
              top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center 
              justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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

export default CreatePlaylist;
