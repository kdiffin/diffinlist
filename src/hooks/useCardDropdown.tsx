import { useAtom } from "jotai";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteParamsAtom, showDeleteAtom } from "~/state/atoms";

function useCardDropdown({ type }: { type: "playlist" | "song" | "profile" }) {
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

  const [showDelete, setShowDelete] = useAtom(showDeleteAtom);
  const [deleteParams, setDeleteParams] = useAtom(deleteParamsAtom);

  function deleteItem() {
    setShowDelete(true);

    if (type === "playlist") {
      console.log("playlist deleted");
    } else {
      console.log("song deleted");
    }

    setDeleteParams({
      deleteFunction: () => console.log("hi"),
      type: "playlist",
    });
  }

  return { textRef, handleCopy, deleteItem };
}

export default useCardDropdown;
