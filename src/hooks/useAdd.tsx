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
      if (e.data?.stack?.includes("invocation:\n\n\nUnique constraint")) {
        toast.error("You can't have 2 playlists with the same name");
        return;
      }

      toast.error("Failed to add playlist, please try again");
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
      if (e.data?.stack?.includes("invocation:\n\n\nUnique constraint")) {
        toast.error("You can't have 2 of the same songs in one playlist");
        return;
      }

      toast.error("Failed to add songs, please try again");
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
