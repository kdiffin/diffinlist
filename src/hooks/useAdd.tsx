import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

function useAdd() {
  const ctx = api.useContext();
  const { user } = useUser();
  const router = useRouter();

  const {
    mutate: addPlaylist,
    isLoading: addPlaylistLoading,
    isSuccess: playlistSuccess,
  } = api.playlist.createPlaylist.useMutation({
    onSuccess: () => {
      ctx.playlist.getPlaylists.invalidate().then(() => {
        router.push(`/${user ? user.username : ""}`);
        toast.success("Added playlist to your profile!");
      });

      ctx.playlist.invalidate();
    },

    onError: (e) => {
      toast.error("Failed to post! Please try again later.");
    },
  });

  const {
    mutate: addSong,
    isLoading: addSongLoading,
    isSuccess: songSuccess,
  } = api.song.createSong.useMutation({
    onSuccess: () => {
      ctx.song.invalidate().then(() => {
        toast.success("Successfully added song to playlist!");
      });
    },

    onError: (e) => {
      toast.error("Failed to post! Please try again later.");
    },
  });

  const loading = addSongLoading || addPlaylistLoading;
  const success = playlistSuccess || songSuccess;

  if (loading) {
    toast.loading("Loading...", {
      id: "loading",
    });
  }

  if (success) {
    toast.dismiss("loading");
  }

  return { addPlaylist, addSong };
}

export default useAdd;
