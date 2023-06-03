import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
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
    isError: playlistError,
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
    isError: songError,
  } = api.song.addSongToPlaylist.useMutation({
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
  const error = playlistError || songError;

  if (loading) {
    toast.loading("Loading...", {
      id: "loading",
    });
  }

  if (success || error) {
    toast.dismiss("loading");
  }

  return { addPlaylist, addSong };
}

export default useAdd;
