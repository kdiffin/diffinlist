import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { InputField, RefInput } from "../ui/Input";
import { api } from "~/utils/api";
import Button from "../ui/Button";
import { LoadingSpinner } from "../ui/Loading";
import { ImageSkeleton } from "../ui/Skeletons";
import {
  MdArrowBack,
  MdArrowCircleLeft,
  MdArrowForward,
  MdArrowLeft,
  MdArrowRightAlt,
  MdEdit,
  MdFlipToBack,
  MdOutlineArrowLeft,
  MdOutlineArrowRight,
  MdPanoramaFishEye,
  MdRedo,
  MdRotateLeft,
  MdTurnLeft,
  MdUndo,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import {
  defaultValues,
  showEditPlaylist,
  showEditSong,
  showPlaylists,
} from "~/state/atoms";
import { useClerk } from "@clerk/nextjs";
import { Input } from "postcss";

//UI is basically a copy paste of the settings one
function EditPlaylist() {
  const router = useRouter();
  const [itemDefaultValues] = useAtom(defaultValues);
  const [playlistPicUrl, setPlaylistPicUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [name, setName] = useState("");
  const [toggleEditPlaylist, setToggleEditPlaylist] = useAtom(showEditPlaylist);

  useEffect(() => {
    setPlaylistPicUrl(itemDefaultValues.pictureUrl);
    setName(itemDefaultValues.playlistName);
    setGenre(itemDefaultValues.genre);
  }, [
    itemDefaultValues.playlistName,
    itemDefaultValues.genre,
    itemDefaultValues.pictureUrl,
  ]);

  const isLoading = false;

  function removeChanges() {
    setGenre("");
    setName("");
    setPlaylistPicUrl("");
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root
      open={toggleEditPlaylist}
      onOpenChange={() => setToggleEditPlaylist(false)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="modal">
          <Dialog.Title className="  text-2xl font-medium">
            Edit playlist
          </Dialog.Title>

          <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
            Edit a playlist here. Click save changes when you're done.
          </Dialog.Description>

          <div className="my-10 flex flex-col items-center justify-between gap-10 sm:flex-row sm:gap-0 ">
            <div className="flex  items-center gap-5 ">
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
                  <ImageSkeleton className={"h-[130px] w-[130px]"} />
                )}

                <div className="flex flex-col gap-3">
                  <div className=" cursor-text text-4xl">
                    {name ? (
                      name
                    ) : (
                      <label
                        htmlFor="Name"
                        className="cursor-text text-2xl italic text-neutral-500 "
                      >
                        enter in name
                      </label>
                    )}
                  </div>

                  <div className=" cursor-text   text-neutral-500">
                    {genre ? (
                      <p className="">Aesthetic / genre: {genre}</p>
                    ) : (
                      <label
                        htmlFor="Aesthetic / genre"
                        className="cursor-text italic text-neutral-500 "
                      >
                        Enter genre
                      </label>
                    )}
                  </div>
                </div>
              </>
            </div>

            <Button
              onClick={removeChanges}
              className="   bg-red-400/30 text-sm"
            >
              Remove changes
            </Button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <InputField
                setValue={setName}
                type="text"
                placeholder="Enter new name"
                name="Name"
                value={name}
              />

              <InputField
                type="url"
                value={playlistPicUrl}
                setValue={setPlaylistPicUrl}
                placeholder="Enter playlist picture URL"
                name="Picture"
              />

              <InputField
                type="text"
                value={genre}
                placeholder="Enter the genre of your playlist"
                setValue={setGenre}
                name="Aesthetic / genre"
              />
            </div>

            <div className="mt-10  flex items-center justify-between">
              <Button type="submit" disabled={isLoading}>
                <MdEdit /> Save changes
              </Button>

              {isLoading ? (
                <div className="flex items-center gap-5 text-zinc-400">
                  Submitting... <LoadingSpinner />
                </div>
              ) : (
                <></>
              )}
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="   absolute right-[10px] 
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

export default EditPlaylist;
