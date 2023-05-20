import { useUser } from "@clerk/nextjs";
import React from "react";
import { toast } from "react-hot-toast";
import { SectionCardNew, SectionNew } from "~/components/SectionNew";
import { api } from "~/utils/api";

function test() {
  const { user, isSignedIn } = useUser();
  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getAllPlaylists.useQuery();

  const ctx = api.useContext();

  const { mutate: songDelete, isLoading: songLoading } =
    api.song.deleteSong.useMutation({
      onSuccess: () => {
        ctx.song.invalidate().then(() => {
          toast.success("Successfully deleted song");
        });
      },

      onError: () => {
        toast.error("Failed to delete song, please try again later.");
      },
    });

  const { mutate: playlistDelete, isLoading: playlistDeleteLoading } =
    api.playlist.deletePlaylist.useMutation({
      onSuccess: () => {
        ctx.playlist.invalidate().then(() => {
          toast.success("Successfully deleted playlist");
        });
      },

      onError: () => {
        toast.error("Failed to delete playlist, please try again later.");
      },
    });

  return (
    <div>
      <SectionNew loading={playlistsLoading} name="song ">
        {playlists && playlists.length > 0
          ? playlists.map((playlist) => {
              const isAuthor = user?.username === playlist.authorName;
              const signedIn = isSignedIn ? isSignedIn : false;

              return (
                <SectionCardNew
                  isAuthor={isAuthor}
                  isSignedIn={signedIn}
                  deleteFunction={() =>
                    playlistDelete({
                      playlistName: playlist.name,
                    })
                  }
                  data={{
                    pictureUrl: playlist.pictureUrl,
                    title: playlist.name,
                  }}
                  type="playlist"
                  href={`/test`}
                />
              );
            })
          : "yo"}
      </SectionNew>
    </div>
  );
}

export default test;
