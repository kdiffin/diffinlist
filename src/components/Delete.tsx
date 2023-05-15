import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "./ui/Button";
import { atom, useAtom } from "jotai";

export const showDeleteAtom = atom(false);

//these two were similar enough that I decided to reuse the UI and seperate the function logic
const Delete = ({
  deleteFunction,
  open,
  type,
}: {
  deleteFunction: Promise<Function>;
  open: boolean;
  type: "song" | "playlist";
}) => {
  //very similar to reacts usestate
  const [showDelete] = useAtom(showDeleteAtom);

  return (
    <AlertDialog.Root open={showDelete}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0  bg-neutral-900/40 data-[state=open]:animate-overlayShow" />

        <AlertDialog.Content
          className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%]
       rounded-sm bg-zinc-900 p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"
        >
          <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-mauve11 mb-5 mt-4 text-[15px] leading-normal">
            This action cannot be undone. This will permanently delete your
            {type} and remove the {type}'s data from our servers.
          </AlertDialog.Description>

          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <Button className="text-sm ">Cancel</Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <Button
                onClick={() => deleteFunction}
                className="bg-red-500 text-sm hover:bg-red-400 focus:bg-red-400 focus:shadow-red-800"
              >
                <p className="">Yes, delete {type}</p>
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default Delete;
