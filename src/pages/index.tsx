import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { FaGithub } from "react-icons/fa";
import { Section, SectionCard } from "~/components/Section";
import Avatar from "~/components/ui/Avatar";
import Divider from "~/components/ui/Divider";

import { useRouter } from "next/router";
import useAdd from "~/hooks/useAdd";
import { api } from "~/utils/api";
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

  const { addPlaylist, addSong } = useAdd();

  return (
    <div className=" flex-col">
      {/* this is the header */}
      <div className=" neutral-lowkey-bg flex   items-center justify-center  px-8 py-14 sm:justify-normal lg:px-14 ">
        <div className="flex flex-col items-center  sm:flex-row sm:gap-8">
          {isLoaded ? (
            <Avatar
              className="p-1"
              loading={!isLoaded}
              width_height={160}
              src={user ? user.profileImageUrl : defaultProfilePic}
            />
          ) : (
            <Avatar
              className=" h-[160px] w-[160px]"
              loading={true}
              width_height={160}
              src={""}
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
        <Section
          showMoreHref={{
            pathname: "/search",
            query: {
              results: "playlists",
            },
          }}
          loading={playlistsLoading}
          title="Playlists"
        >
          {playlists && playlists.length > 0 ? (
            playlists.map((playlist) => {
              return (
                <SectionCard
                  type="playlist"
                  href={`/${playlist.authorName}/${playlist.name}`}
                  data={{
                    pictureUrl: playlist.pictureUrl,
                    authorName: playlist.authorName,
                    genre: playlist.genre,
                    playlistName: playlist.name,
                  }}
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

        <Section
          showMoreHref={{
            pathname: "/search",
            query: {
              results: "songs",
            },
          }}
          loading={songsLoading}
          title="Songs"
        >
          {songs && songs.length > 0 ? (
            songs.map((song) => {
              return (
                <SectionCard
                  data={{
                    pictureUrl: song.pictureUrl,
                    songId: song.id,
                    authorName: song.authorName,
                    genre: song.genre,
                    playlistName: song.playlistName,
                    songName: song.name,
                  }}
                  href={{
                    pathname: router.route,
                    query: {
                      ...router.query,
                      song: song.id,
                    },
                  }}
                  type="song"
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

        <Section
          loading={usersLoading}
          showMoreHref={{
            pathname: "/search",
            query: {
              results: "users",
            },
          }}
          title="Users"
        >
          {users && users.length > 0 ? (
            users.map((user) => {
              return (
                <SectionCard
                  type="profile"
                  href={`/${user.username}`}
                  key={user.username}
                  //none of these below matter because the user doesnt have a dropdown like the others do
                  data={{
                    pictureUrl: user.profileImageUrl,
                    authorName: "",
                    genre: "",
                    playlistName: "",

                    // this is basically the title of the  card
                    songName: user.username,
                  }}
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
