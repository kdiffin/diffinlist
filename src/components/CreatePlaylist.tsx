import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "./ui/Input";
import { api } from "~/utils/api";
import Button from "./ui/Button";
import { toast } from "react-hot-toast";
import { error } from "console";
import { LoadingSpinner } from "./ui/Loading";

//UI is basically a copy paste of the settings one
function CreatePlaylist() {
  const router = useRouter();
  const [playlistPicUrl, setPlaylistPicUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [name, setName] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading } = api.playlist.createPlaylist.useMutation({
    onSuccess: () => {
      removeChanges();
      ctx.playlist.getPlaylistsByProfileName
        .invalidate()
        .then(() => closeCreatePlaylist())
        .catch((err) => console.error(err));
    },

    onError: (e) => {
      const errorMessagePicture = e.data?.zodError?.fieldErrors.picture;
      const errorMessageName = e.data?.zodError?.fieldErrors.name;

      // okay another crazy if else lets get to explaining
      // first it checks if the playlists name already exists on your profile
      // if not, then it checks both the picture and the name's error fields
      // and finally if the manual checks fail but theres still an error it shows a default toast.

      if (e.data?.stack?.includes("invocation:\n\n\nUnique constraint")) {
        toast.error("You can't have 2 playlists with the same name");
      } else {
        if (errorMessageName && errorMessageName[0]) {
          toast.error(errorMessageName[0]);
          setName("");
        }
        if (errorMessagePicture && errorMessagePicture[0]) {
          toast.error(errorMessagePicture[0]);
          setPlaylistPicUrl("");
        } else {
          toast.error("Failed to post! Please try again later.");
        }
      }
    },
  });

  const isOpen = router.query?.showCreatePlaylist === "true";

  function closeCreatePlaylist() {
    delete router.query?.showCreatePlaylist;

    router.replace(router, undefined, { shallow: true });
  }

  function removeChanges() {
    setGenre("");
    setName("");
    setPlaylistPicUrl("");
  }

  function addPlaylist(e: { preventDefault: () => void }) {
    e.preventDefault();
    mutate({
      name: name,
      genre: genre,
      picture: playlistPicUrl,
    });
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <>
      <Dialog.Root open={isOpen} onOpenChange={closeCreatePlaylist}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="subtle-scrollbar fixed  left-[50%] top-[50%] max-h-[85vh] w-[85vw] translate-x-[-50%] translate-y-[-50%]  overflow-y-scroll rounded-sm bg-zinc-900 p-10 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow lg:max-w-[70vw]">
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
                    <label
                      htmlFor="playlist picture"
                      className="flex h-[130px] w-[130px] items-center justify-center rounded-sm border-2 border-dotted border-neutral-700 text-center italic text-neutral-500"
                    >
                      No Image
                    </label>
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
                className=" px-4  text-sm   text-neutral-500"
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
    </>
  );
}

export default CreatePlaylist;
