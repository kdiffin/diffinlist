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
import useDelete from "~/hooks/useDelete";
import useAdd from "~/hooks/useAdd";

const Home: NextPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { data: users, isLoading: usersLoading } =
    api.profile.getAllUsers.useQuery();
  const username = user && user.username ? user.username : "";

  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getAllPlaylists.useQuery();

  const { data: songs, isLoading: songsLoading } =
    api.song.getAllSongs.useQuery();

  const {
    playlistDelete,
    playlistDeleteLoading,
    songDelete,
    songDeleteLoading,
  } = useDelete();
  const { addPlaylist, addSong } = useAdd();

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
        <Section loading={playlistsLoading} title="Playlists">
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
                    authorName: playlist.authorName,
                    genre: playlist.genre,
                    playlistName: playlist.name,
                  }}
                  addFunction={() => {
                    addPlaylist({
                      genre: playlist.genre,
                      name: playlist.name,
                      picture: playlist.pictureUrl,
                    });
                  }}
                  deleteFunction={() =>
                    playlistDelete({
                      playlistName: playlist.name,
                    })
                  }
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

        <Section loading={songsLoading} title="Songs">
          {songs && songs.length > 0 ? (
            songs.map((song) => {
              const isAuthor = user?.username === song.authorName;
              const signedIn = isSignedIn ? isSignedIn : false;

              return (
                <SectionCard
                  addFunction={(playlistName) => {
                    addSong({
                      genre: song.genre,
                      name: song.name,
                      playlistName: playlistName,
                      pictureUrl: song.pictureUrl,
                      songUrl: song.songUrl,
                      albumName: song.album,
                      artistName: song.artist,
                      description: song.description,
                      rating: song.rating,
                    });
                  }}
                  deleteFunction={() =>
                    songDelete({
                      name: song.name,
                      playlistName: song.playlistName,
                    })
                  }
                  data={{
                    pictureUrl: song.pictureUrl,
                    authorName: song.authorName,
                    genre: song.genre,
                    playlistName: song.playlistName,
                    songName: song.name,
                  }}
                  href={{
                    pathname: router.route,
                    query: {
                      song: song.name,
                      playlist: song.playlistName,
                      profileName: song.authorName,
                    },
                  }}
                  type="song"
                  shallow
                  isAuthor={isAuthor}
                  isSignedIn={signedIn}
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

        <Section loading={usersLoading} title="Users">
          {users && users.length > 0 ? (
            users.map((user) => {
              return (
                <SectionCard
                  type="profile"
                  href={`/${user.username}`}
                  key={user.username}
                  //none of these below matter because the user doesnt have a dropdown like the others do
                  isAuthor={false}
                  isSignedIn={false}
                  addFunction={() => null}
                  data={{
                    pictureUrl: user.profileImageUrl,
                    authorName: "",
                    genre: "",
                    playlistName: "",

                    // this is basically the title of the  card
                    songName: user.username,
                  }}
                  deleteFunction={() => null}
                />
              );
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
