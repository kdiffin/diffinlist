import { useAtom } from "jotai";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteParamsAtom, showDeleteAtom } from "~/state/atoms";
import { api } from "~/utils/api";

function useCardDropdown({
  type,
  deleteFunction,
}: {
  type: "playlist" | "song" | "profile";
  deleteFunction: VoidFunction;
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

  //for the edit playlist/song button

  return { textRef, handleCopy, deleteItem };
}

export default useCardDropdown;
