import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "./ui/Input";
import { api } from "~/utils/api";
import Button from "./ui/Button";
import { toast } from "react-hot-toast";
import { error } from "console";
import { LoadingSpinner } from "./ui/Loading";
import { ImageSkeleton } from "./ui/Skeletons";

//UI is basically a copy paste of the settings one
function CreateSong() {
  const router = useRouter();
  const [playlistPicUrl, setPlaylistPicUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [name, setName] = useState("");
  const ctx = api.useContext();
  const isLoading = false;

  const isOpen = router.query?.showCreateSong === "true";

  function closeCreatePlaylist() {
    delete router.query?.showCreateSong;

    router.replace(router, undefined, { shallow: true });
  }

  function removeChanges() {
    setGenre("");
    setName("");
    setPlaylistPicUrl("");
  }

  function addPlaylist(e: { preventDefault: () => void }) {
    e.preventDefault();
    // add mutate fiunction
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <>
      <Dialog.Root open={isOpen} onOpenChange={closeCreatePlaylist}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="modal">
            <Dialog.Title className="  text-2xl font-medium">
              Create playlist
            </Dialog.Title>

            <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
              Create a playlist here. Click add playlist when you're done.
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
                    <label htmlFor="name" className=" cursor-text text-4xl">
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
                      htmlFor="name"
                      className=" cursor-text   text-neutral-500"
                    >
                      {genre ? (
                        <p className="">Aesthetic / genre: {genre}</p>
                      ) : (
                        <label
                          htmlFor="genre"
                          className="cursor-text italic text-neutral-500 "
                        >
                          Enter genre
                        </label>
                      )}
                    </label>
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

            <form onSubmit={(e) => addPlaylist(e)}>
              <div>
                <fieldset className="mb-6 flex items-center gap-5">
                  <label
                    className=" w-[90px]  text-right text-[15px]"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <Input
                    onChange={setName}
                    type="text"
                    name="name "
                    id="name"
                    value={name}
                    placeholder="Enter new name"
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
                    id="playlist picture"
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
                <Dialog.Close onClick={addPlaylist} asChild>
                  <Button type="submit" disabled={isLoading}>
                    + Add playlist
                  </Button>
                </Dialog.Close>

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
    </>
  );
}

export default CreateSong;
