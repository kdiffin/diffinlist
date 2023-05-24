import { useAtom } from "jotai";
import React from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

function useDelete() {
  const ctx = api.useContext();

  const {
    mutate: songDelete,
    isLoading: songDeleteLoading,
    isSuccess: playlistSuccess,
  } = api.song.deleteSong.useMutation({
    onSuccess: () => {
      ctx.song.invalidate().then(() => {
        toast.success("Successfully deleted song");
      });
    },

    onError: () => {
      toast.error("Failed to delete song, please try again later.");
    },
  });

  const {
    mutate: playlistDelete,
    isLoading: playlistDeleteLoading,
    isSuccess: songSuccess,
  } = api.playlist.deletePlaylist.useMutation({
    onSuccess: () => {
      ctx.playlist.invalidate().then(() => {
        toast.success("Successfully deleted playlist");
      });
    },

    onError: () => {
      toast.error("Failed to delete playlist, please try again later.");
    },
  });

  const loading = playlistDeleteLoading || songDeleteLoading;
  const success = playlistSuccess || songSuccess;

  if (loading) {
    toast.loading("Loading...", {
      id: "loading",
    });
  }

  if (success) {
    toast.dismiss("loading");
  }
  return {
    playlistDelete,
    songDelete,
    songDeleteLoading,
    playlistDeleteLoading,
  };
}

export default useDelete;
