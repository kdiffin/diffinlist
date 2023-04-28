import { useRouter } from "next/router";
import React, {
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Input, { InputField } from "./ui/Input";
import { api } from "~/utils/api";
import Button from "./ui/Button";
import { toast } from "react-hot-toast";
import { error } from "console";
import { LoadingSpinner } from "./ui/Loading";
import { ImageSkeleton } from "./ui/Skeletons";

//UI is basically a copy paste of the settings one
function CreateSong() {
  const router = useRouter();
  const [pictureUrl, setPictureUrl] = useState("");
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
    setPictureUrl("");
  }

  function addPlaylist(e: { preventDefault: () => void }) {
    e.preventDefault();
    // add mutate fiunction
  }

  //   Rating: 9.5/10

  // Description: batshit insane solo at 2:00

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <>
      <Dialog.Root open={isOpen} onOpenChange={closeCreatePlaylist}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="modal !max-h-[93vh] ">
            <Dialog.Title className="  text-2xl font-medium">
              Add Song
            </Dialog.Title>

            <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
              Add a song or album here. Click add song when you're done.
            </Dialog.Description>

            <div className="my-10 flex flex-col items-center justify-between gap-10 sm:flex-row sm:gap-0 ">
              <div className="flex  items-center gap-5 ">
                <>
                  {pictureUrl ? (
                    <img
                      alt="Playlist Image"
                      src={pictureUrl}
                      width={130}
                      className="rounded-sm bg-cover "
                      height={130}
                    />
                  ) : (
                    <ImageSkeleton className={"h-[130px] w-[130px]"} />
                  )}

                  <div className="flex flex-col gap-3">
                    <label htmlFor="Name" className=" cursor-text text-4xl">
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
                    </label>

                    <label
                      htmlFor="Aesthetic / genre"
                      className=" cursor-text   text-neutral-500"
                    >
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
                <InputField
                  name="Name"
                  value={name}
                  type="text"
                  placeholder="Enter new name"
                  setValue={setName}
                />

                <InputField
                  name="Picture"
                  value={pictureUrl}
                  type="url"
                  placeholder="Enter picture URL"
                  setValue={setPictureUrl}
                />

                <InputField
                  name="Song URL"
                  value={pictureUrl}
                  type="text"
                  placeholder="The link to the song itself (youtube, spotify, soundcloud etc)"
                  setValue={setPictureUrl}
                />

                <InputField
                  name="Aesthetic / genre"
                  value={pictureUrl}
                  type="text"
                  placeholder="Genre of the song"
                  setValue={setPictureUrl}
                />
                {/* 
                <InputField
                  name="Artist"
                  value={pictureUrl}
                  type="text"
                  placeholder="Artist who made the song"
                  setValue={setPictureUrl}
                />

                <InputField
                  name="Album"
                  value={pictureUrl}
                  type="text"
                  placeholder="The album which the song belongs to"
                  setValue={setPictureUrl}
                />

                <InputField
                  name="Sub genre"
                  value={pictureUrl}
                  type="text"
                  placeholder="A sub genre the song might belong to"
                  setValue={setPictureUrl}
                />

                <InputField
                  name="Description"
                  value={pictureUrl}
                  type="text"
                  placeholder="Genre of the song"
                  setValue={setPictureUrl}
                /> */}
              </div>

              <div className="mt-10  flex items-center justify-between">
                <Dialog.Close onClick={addPlaylist} asChild>
                  <Button type="submit" disabled={isLoading}>
                    + Add song
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
