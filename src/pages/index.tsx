import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Sidebar from "~/components/Sidebar";
import Avatar from "~/components/ui/Avatar";
import Divider from "~/components/ui/Divider";
import { Section, SectionCard } from "~/components/ui/Section";
import { SquareSkeleton } from "~/components/ui/Skeletons";
import { FaGithub } from "react-icons/fa";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import defaultProfilePic from "../public/defaultuser.png";

const Home: NextPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { data: users, isLoading: usersLoading } =
    api.profile.getAllUsers.useQuery();

  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getAllPlaylists.useQuery();

  const { data: songs, isLoading: songsLoading } =
    api.song.getAllSongs.useQuery();

  return (
    <div className=" flex-col">
      {/* this is the header */}
      <div className=" neutral-lowkey-bg flex   items-center justify-center  px-8 py-14 sm:justify-normal lg:px-14 ">
        <div className="flex flex-col items-center  sm:flex-row sm:gap-8">
          {user ? (
            <Avatar
              className="p-1"
              loading={!isLoaded}
              width_height={160}
              src={user.profileImageUrl}
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
              return (
                <SectionCard
                  href={`/${playlist.authorName}/${playlist.name}`}
                  pictureUrl={playlist.pictureUrl}
                  title={playlist.name}
                  key={playlist.id}
                />
              );

              <></>;
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
              return (
                <SectionCard
                  href={{
                    pathname: router.route,
                    query: {
                      song: song.name,
                      playlist: song.playlistName,
                      profileName: song.authorName,
                    },
                  }}
                  pictureUrl={song.pictureUrl}
                  title={song.name}
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
                  href={`/${user.username}`}
                  avatar
                  pictureUrl={user.profileImageUrl}
                  title={user.username}
                  key={user.username}
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
