//using a new state management library called jotai, it works based on atomic principles
//and it eliminates unnecesary rerenders.
//https://jotai.org/

import { atom } from "jotai";

export const showDeleteAtom = atom(false);

export const deleteParamsAtom = atom<DeleteParams>({
  type: "playlist",
  deleteFunction: () => null,
});

type DeleteParams = {
  type: "playlist" | "song" | "profile";
  deleteFunction: VoidFunction;
};
