import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { validQuery } from "~/server/helpers/validateQuery";
import { api } from "~/utils/api";
import Button from "../ui/Button";
import { InputField, RefInputField } from "../ui/Input";
import { LoadingSpinner } from "../ui/Loading";
import { ImageSkeleton } from "../ui/Skeletons";

function CreateSong() {
  const router = useRouter();
  const isOpen = router.query?.showCreateSong === "true";

  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const artistRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);
  const ratingRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [nextStep, setNextStep] = useState(false);

  const ctx = api.useContext();
  const { mutate, isLoading } = api.song.createSong.useMutation({
    onSuccess: () => {
      removeChanges();
      void ctx.song.invalidate().then(() => closeCreateSong());
    },

    onError: (e) => {
      const errorMessagePicture = e.data?.zodError?.fieldErrors.picture;
      const errorMessageName = e.data?.zodError?.fieldErrors.name;
      const errorMessageGenre = e.data?.zodError?.fieldErrors.genre;
      const errorMessageSongUrl = e.data?.zodError?.fieldErrors.songUrl;
      const errorMessageRating = e.data?.zodError?.fieldErrors.rating;

      if (e.message === "Please make sure your URL is a picture URL.") {
        toast.error(e.message);
        setPictureUrl("");

        return;
      }

      if (e.data?.stack?.includes("invocation:\n\n\nUnique constraint")) {
        toast.error("You can't have 2 songs with the same name");
        setName("");
      } else {
        if (errorMessageName && errorMessageName[0]) {
          toast.error(errorMessageName[0]);
          setName("");
        }
        if (errorMessagePicture && errorMessagePicture[0]) {
          toast.error(errorMessagePicture[0]);
          setPictureUrl("");
        }
        if (errorMessageGenre && errorMessageGenre[0]) {
          toast.error(errorMessageGenre[0]);
          setGenre("");
        }
        if (errorMessageRating && errorMessageRating[0]) {
          toast.error(errorMessageRating[0]);
          albumRef.current!.value = "";
        }
        if (errorMessageSongUrl && errorMessageSongUrl[0]) {
          toast.error(errorMessageSongUrl[0]);
          setSongUrl("");
        } else {
          toast.error("Failed to post! Please try again later.");
        }
      }
    },
  });

  function closeCreateSong() {
    delete router.query?.showCreateSong;
    void router.replace(router, undefined, { shallow: true });
  }

  function removeChanges() {
    setGenre("");
    setName("");
    setPictureUrl("");
    setSongUrl("");

    albumRef.current ? (albumRef.current.value = "") : null;
    artistRef.current ? (artistRef.current.value = "") : null;
    ratingRef.current ? (ratingRef.current.value = "") : null;
    descriptionRef.current ? (descriptionRef.current.value = "") : null;
  }

  function addSong(e: { preventDefault: () => void }) {
    e.preventDefault();
    // add mutate fiunction
    const validPlaylist = validQuery(router.query.playlist);

    mutate({
      name: name,
      pictureUrl: pictureUrl,
      songUrl: songUrl,
      genre: genre,
      playlistName: validPlaylist ? validPlaylist : "",

      albumName: albumRef.current?.value,
      artistName: artistRef.current?.value,
      description: descriptionRef.current?.value,

      rating: ratingRef.current ? parseInt(ratingRef.current.value) : undefined,
    });
  }

  return (
    // https://www.radix-ui.com/docs/primitives/components/dialog#dialog
    <Dialog.Root open={isOpen} onOpenChange={closeCreateSong}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="modal !max-h-[93vh]  ">
          <div className="absolute left-1/2 top-3 flex gap-1">
            <div
              className={`
                ${nextStep ? "bg-transparent" : "bg-white"}
                 rounded-full border p-[2.5px]`}
            />
            <div
              className={`
                ${nextStep ? "bg-white" : "bg-transparent"} 
                rounded-full border  p-[2.5px]`}
            />
          </div>

          <Dialog.Title className="  text-2xl font-medium">
            {!nextStep ? "Add Song" : "Optional fields"}
          </Dialog.Title>

          <Dialog.Description className="text-mauve11 mb-5 mt-3 text-[15px] leading-normal">
            {!nextStep
              ? "Create a song here. Click add song when you're done."
              : "These fields are skippable. hi!!!!!!!"}
          </Dialog.Description>

          <div className="my-10 flex flex-col items-center justify-between gap-10 sm:flex-row sm:gap-0 ">
            <div className="flex  items-center gap-5 ">
              <>
                {pictureUrl ? (
                  <img
                    alt="Playlist img"
                    src={pictureUrl}
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
                      <a href={songUrl} target="_blank">
                        {name}
                      </a>
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

          <form onSubmit={(e) => addSong(e)}>
            <div>
              {!nextStep ? (
                <>
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
                    name="Aesthetic / genre"
                    value={genre}
                    type="text"
                    placeholder="Genre of the song"
                    setValue={setGenre}
                  />
                  <InputField
                    name="Song URL"
                    value={songUrl}
                    type="url"
                    placeholder="The link to the song itself (youtube, spotify, soundcloud etc)"
                    setValue={setSongUrl}
                  />
                </>
              ) : (
                <>
                  <RefInputField
                    name="Artist"
                    ref={artistRef}
                    type="text"
                    placeholder="Artist who made the song"
                  />

                  <RefInputField
                    name="Album"
                    ref={albumRef}
                    type="text"
                    placeholder="The album which the song belongs to"
                  />

                  <RefInputField
                    name="Rating"
                    ref={ratingRef}
                    type="number"
                    min={0}
                    max={10}
                    placeholder="Rating / 10"
                  />

                  <RefInputField
                    name="Description"
                    ref={descriptionRef}
                    type="text"
                    placeholder="Short description of the song"
                  />
                </>
              )}
            </div>

            <div className="mt-10  flex items-center justify-between">
              <Button type="submit" disabled={isLoading}>
                + Add Song
              </Button>

              {isLoading ? (
                <div className="flex items-center gap-5 text-zinc-400">
                  Submitting... <LoadingSpinner />
                </div>
              ) : nextStep ? (
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setNextStep(false)}
                >
                  <MdOutlineArrowLeft /> Back
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setNextStep(true)}
                >
                  <MdOutlineArrowRight /> Extra
                </Button>
              )}
            </div>
          </form>

          <div className="absolute right-[0px] top-[10px] flex w-[100%] justify-between  px-4">
            <div></div>
            <Dialog.Close asChild>
              <button
                className=" 
               inline-flex h-[25px] w-[25px] appearance-none items-center 
              justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                X
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CreateSong;
