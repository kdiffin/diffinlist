//using a new state management library called jotai, it works based on atomic principles
//and it eliminates unnecesary rerenders.
//https://jotai.org/

import { atom } from "jotai";

export const showDeleteAtom = atom(false);
export const showPlaylists = atom(false);
export const showEditPlaylist = atom(false);
export const showEditSong = atom(false);

export const deleteParamsAtom = atom<DeleteParams>({
  type: "playlist",
  deleteFunction: () => null,
});

export const addSongToPlaylist = atom<AddFunction>({
  addFunction: (playlistName: string) => null,
});

export const defaultValues = atom({
  pictureUrl: "",
  name: "",
  genre: "",
});

type DeleteParams = {
  type: "playlist" | "song" | "profile";
  deleteFunction: VoidFunction;
};

type AddFunction = {
  addFunction: (playlistName: string) => void;
};
