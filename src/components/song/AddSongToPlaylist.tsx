import React, { Dispatch, useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

//not to be confused with createsong this moves a song from one playlist to another
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "../ui/Button";
import { atom, useAtom } from "jotai";
import { addSongToPlaylist, showPlaylists } from "~/state/atoms";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { MdAdd } from "react-icons/md";
import { Playlist } from "@prisma/client";
import Loading, { LoadingSpinner } from "../ui/Loading";
import { DialogOverlay } from "@radix-ui/react-dialog";

// similar pattern to delete.tsx
function AddSongToPlaylist() {
  const [showPlaylistsToAdd, setShowPlaylistsToAdd] = useAtom(showPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [addSongToPlaylistParams] = useAtom(addSongToPlaylist);
  const { user } = useUser();
  const { data: playlists, isLoading } = api.playlist.getPlaylists.useQuery({
    profileName: user && user.username ? user.username : "",
    takeLimit: 12312313,
  });

  console.log(addSongToPlaylistParams);

  return (
    <AlertDialog.Root
      open={showPlaylistsToAdd}
      onOpenChange={() => setShowPlaylistsToAdd(false)}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />

        <AlertDialog.Content
          className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]
       rounded-sm bg-zinc-900 p-6  focus:outline-none data-[state=open]:animate-contentShow"
        >
          <AlertDialog.Title className="text-mauve12 m-0 text-lg font-medium">
            Playlists
          </AlertDialog.Title>
          <AlertDialog.Description className="text-mauve11  mt-4  leading-normal">
            Choose which playlist you want the song added to.
          </AlertDialog.Description>

          <Playlists
            loading={isLoading}
            playlists={playlists}
            setSelectedPlaylist={setSelectedPlaylist}
          />

          <AlertDialog.Cancel asChild>
            <button className="fixed right-2 top-1 p-1 text-sm">X</button>
          </AlertDialog.Cancel>

          <AlertDialog.Action className="mt-1 text-xs" asChild>
            <Button
              onClick={() =>
                addSongToPlaylistParams.addFunction(selectedPlaylist)
              }
            >
              <MdAdd className="mr-1 " /> Add
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

function Playlists({
  playlists,
  loading,
  setSelectedPlaylist,
}: {
  playlists: Playlist[] | undefined;
  loading: boolean;
  setSelectedPlaylist: Dispatch<React.SetStateAction<string>>;
}) {
  if (loading) {
    return (
      <div className="flex h-[150px] w-full items-center justify-center ">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form>
      <RadioGroup.Root
        required
        onValueChange={(value) => setSelectedPlaylist(value)}
        className="my-5 flex flex-col gap-2.5"
        defaultValue="default"
        aria-label="Playlists to add your song to"
      >
        {playlists?.map((playlist) => {
          return (
            <div className="flex items-center">
              <RadioGroup.Item
                className="h-6 w-6 cursor-pointer rounded-sm bg-zinc-700
           shadow-[0_2px_10px] shadow-neutral-800 outline-none hover:bg-zinc-600 focus:shadow-[0_0_0_2px] focus:shadow-neutral-600"
                value={playlist.name}
                id={playlist.name}
              >
                <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:text-lg after:font-black after:text-neutral-300 after:content-['✓']" />
              </RadioGroup.Item>

              <label
                className="pl-4 text-lg leading-none text-white"
                htmlFor={playlist.name}
              >
                {playlist.name}
              </label>
            </div>
          );
        })}
      </RadioGroup.Root>
    </form>
  );
}

export default AddSongToPlaylist;
