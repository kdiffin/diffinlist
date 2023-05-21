import { useAtom } from "jotai";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteParamsAtom, showDeleteAtom, showPlaylists } from "~/state/atoms";
import { api } from "~/utils/api";

function useCardDropdown({
  type,
  deleteFunction,
  addFunction,
}: {
  type: "playlist" | "song" | "profile";
  deleteFunction: VoidFunction;
  addFunction: (playlistName: string) => void;
}) {
  //for the copy button
  const textRef = useRef<HTMLInputElement>(null);

  function handleCopy() {
    if (textRef.current) {
      textRef.current.select();
      textRef.current.setSelectionRange(0, 99999); // For mobile devices

      navigator.clipboard.writeText(textRef.current.value).then(() => {
        toast.success("Link successfully copied to clipboard!");
      });
    }
  }

  //early return cuz the profile ones dont have these extra fields, only copy url
  if (type === "profile") {
    return { textRef, handleCopy };
  }

  //for the delete playlist/song button
  const [deleteParams, setDeleteParams] = useAtom(deleteParamsAtom);
  const [showDelete, setShowDelete] = useAtom(showDeleteAtom);
  function deleteItem() {
    setShowDelete(true);

    setDeleteParams({
      deleteFunction: deleteFunction,
      type: type,
    });
  }

  //for the add playlist/song to profile/plalyist button
  const [showPlaylistsToAdd, setShowPlaylistsToAdd] = useAtom(showPlaylists);

  function addItem() {
    //when adding a playlist, just adds it to ur profile
    if (type === "playlist") {
      addFunction("");
      return;
    }

    //when adding a song, here we need a modal which lets us choose which playlist to add the song to
    setShowPlaylistsToAdd(true);
  }

  return { textRef, handleCopy, deleteItem, addItem };
}

export default useCardDropdown;