import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Sidebar from "~/components/Sidebar";
import Avatar from "~/components/ui/Avatar";
import Divider from "~/components/ui/Divider";
import { Section, SectionCard } from "~/components/Section";
import { SquareSkeleton } from "~/components/ui/Skeletons";
import { FaGithub } from "react-icons/fa";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import defaultProfilePic from "../public/defaultuser.png";

const Home: NextPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { data: users, isLoading: usersLoading } =
    api.profile.getAllUsers.useQuery();

  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getAllPlaylists.useQuery();

  const { data: songs, isLoading: songsLoading } =
    api.song.getAllSongs.useQuery();

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
    <div className=" flex-col">
      {/* this is the header */}
      <div className=" neutral-lowkey-bg flex   items-center justify-center  px-8 py-14 sm:justify-normal lg:px-14 ">
        <div className="flex flex-col items-center  sm:flex-row sm:gap-8">
          {isSignedIn ? (
            <Avatar
              className="p-1"
              loading={!isLoaded}
              width_height={160}
              src={user?.profileImageUrl}
            />
          ) : (
            <Image
              alt="default avatar"
              src={defaultProfilePic}
              width={160}
              className="rounded-full p-1"
              height={160}
            />
          )}

          <div className="mt-10 flex  flex-col gap-5">
            <p className="text-5xl  ">{`Welcome ${
              user ? user.username + "!!" : "user!!"
            } `}</p>

            <div className=" text-neutral-400">
              <p className="flex items-center gap-2">
                This project is open source!!
              </p>

              <p className=" flex items-center gap-2">
                You can view the source code here:
                <a target="blank" href="https://github.com/diffim/diffinlist">
                  <FaGithub size={18} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* this is the body */}
      <div className="flex flex-col  gap-12 p-10 py-10">
        {/* playlists should get filtered when clicked on view more */}
        {/* the reason i didnt reuse the .map function is because I lose typesafety. as different APIS return different objects */}
        <Section loading={playlistsLoading} name="Playlists">
          {playlists && playlists.length > 0 ? (
            playlists.map((playlist) => {
              const isAuthor = user?.username === playlist.authorName;
              const signedIn = isSignedIn ? isSignedIn : false;

              return (
                <SectionCard

                isAuthor={isAuthor}
                isSignedIn={signedIn}
                  type="playlist"
                  href={`/${playlist.authorName}/${playlist.name}`}
                  data={{
                    pictureUrl: playlist.pictureUrl,
                    title: playlist.name,
                  }}
                  deleteFunction={() => }
                  key={playlist.id}
                />
              );

            })
          ) : (
            <p className="flex w-full items-center justify-center p-5 text-sm font-medium text-neutral-500 ">
              No playlists found
            </p>
          )}
        </Section>

        <Divider />

        <Section loading={songsLoading} name="Songs">
          {songs && songs.length > 0 ? (
            songs.map((song) => {
              const isAuthor = user?.username === song.authorName;
              const signedIn = isSignedIn ? isSignedIn : false;

              return (
                <SectionCard
                deleteFunction={() => songDelete}
                  type="song"
                  data={{
                    pictureUrl: song.pictureUrl,
                    title: song.name
                  }}
                  isAuthor={isAuthor}
                  isSignedIn={signedIn}
  
                  href={{
                    pathname: router.route,
                    query: {
                      song: song.name,
                      playlist: song.playlistName,
                      profileName: song.authorName,
                    },
                  }}
                  shallow
                  key={song.id}
                />
              );
            })
          ) : (
            <p className="flex w-full items-center justify-center p-5 text-sm font-medium text-neutral-500 ">
              No songs found
            </p>
          )}
        </Section>

        <Divider />

        <Section loading={usersLoading} name="Users">
          {users && users.length > 0 ? (
            users.map((user) => {
              return (
                <SectionCard
                  data={undefined}
                  type="profile"
                  href={`/${user.username}`}
                  isProfile
                  pictureUrl={user.profileImageUrl}
                  title={user.username}
                  key={user.username}
                  username={""}
                  authorName={"a"}
                />
              );

              <></>;
            })
          ) : (
            <p className="flex w-full items-center justify-center p-5 text-sm font-medium text-neutral-500 ">
              No users found
            </p>
          )}
        </Section>
      </div>
    </div>
  );
};

export default Home;
