import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

function useDelete() {
  const ctx = api.useContext();

  const {
    mutate: songDelete,
    isLoading: songDeleteLoading,
    isSuccess: playlistSuccess,
    isError: playlistError,
  } = api.song.deleteSong.useMutation({
    onSuccess: () => {
      void ctx.song.invalidate().then(() => {
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
    isError: songError,
  } = api.playlist.deletePlaylist.useMutation({
    onSuccess: () => {
      void ctx.playlist.invalidate().then(() => {
        toast.success("Successfully deleted playlist");
      });
    },

    onError: () => {
      toast.error("Failed to delete playlist, please try again later.");
    },
  });

  const loading = playlistDeleteLoading || songDeleteLoading;
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
  return {
    playlistDelete,
    songDelete,
    songDeleteLoading,
    playlistDeleteLoading,
  };
}

export default useDelete;
