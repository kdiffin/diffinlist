import { useClerk } from "@clerk/nextjs";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import Button from "../ui/Button";
import { InputField } from "../ui/Input";
import { LoadingSpinner } from "../ui/Loading";
import { ImageSkeleton } from "../ui/Skeletons";

function CreatePlaylist() {
  const router = useRouter();
  const [playlistPicUrl, setPlaylistPicUrl] = useState("");
  const [genre, setGenre] = useState("");
  const { user } = useClerk();
  const [name, setName] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading, data, error } =
    api.playlist.createPlaylist.useMutation({
      onSuccess: () => {
        removeChanges();
        ctx.playlist.getPlaylists.invalidate().then(() => {
          router.push(`/${user ? user.username : ""}`);
        });

        ctx.playlist.invalidate();
      },

      onError: (e) => {
        const errorMessagePicture = e.data?.zodError?.fieldErrors.picture;
        const errorMessageName = e.data?.zodError?.fieldErrors.name;

        if (e.message === "Please make sure your URL is a picture URL.") {
          toast.error(e.message);
          setPlaylistPicUrl("");

          return;
        }

        // okay another crazy if else lets get to explaining
        // first it checks if the playlists name already exists on your profile
        // if not, then it checks both the picture and the name's error fields
        // and finally if the manual checks fail but theres still an error it shows a default toast.

        if (e.data?.stack?.includes("invocation:\n\n\nUnique constraint")) {
          toast.error("You can't have 2 playlists with the same name");
          setName("");
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

    void router.replace(router, undefined, { shallow: true });
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

            <form onSubmit={(e) => addPlaylist(e)}>
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
                  + Add playlist
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
    </>
  );
}

export default CreatePlaylist;
