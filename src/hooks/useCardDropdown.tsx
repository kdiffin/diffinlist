import { useAtom } from "jotai";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteParamsAtom, showDeleteAtom } from "~/state/atoms";
import { api } from "~/utils/api";

function useCardDropdown({
  type,
  playlistName,
  songName,
}: {
  type: "playlist" | "song" | "profile";
  songName: string | undefined;
  playlistName: string | undefined;
}) {
  const textRef = useRef<HTMLInputElement>(null);
  const ctx = api.useContext();
  const { mutate: songDelete } = api.song.deleteSong.useMutation({
    onSuccess: () => {
      ctx.song.invalidate().then(() => {
        toast.success("Successfully deleted song");
      });
    },

    onError: () => {
      toast.error("Failed to delete song, please try again later.");
    },
  });

  function handleCopy() {
    if (textRef.current) {
      textRef.current.select();
      textRef.current.setSelectionRange(0, 99999); // For mobile devices

      navigator.clipboard.writeText(textRef.current.value).then(() => {
        toast.success("Link successfully copied to clipboard!");
      });
    }
  }

  const [deleteParams, setDeleteParams] = useAtom(deleteParamsAtom);
  const [showDelete, setShowDelete] = useAtom(showDeleteAtom);

  let deleteFunction = () => {
    return;
  };

  function deleteItem() {
    setShowDelete(true);

    if (type === "playlist") {
      console.log("playlist deleted");
    } else {
      console.log("song deleted");
      deleteFunction = () => {
        songDelete({
          name: songName ? songName : "",
          playlistName: playlistName ? playlistName : "",
        });
      };
    }

    setDeleteParams({
      deleteFunction: deleteFunction,
      type: type,
    });
  }

  return { textRef, handleCopy, deleteItem };
}

export default useCardDropdown;
