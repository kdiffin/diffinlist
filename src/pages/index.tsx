import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Sidebar from "~/components/Sidebar";
import Avatar from "~/components/ui/Avatar";
import Divider from "~/components/ui/Divider";
import { Section } from "~/components/ui/Section";
import { SquareSkeleton } from "~/components/ui/Skeletons";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { user, isLoaded } = useUser();

  const playlistsLoading = false;

  return (
    <div className=" flex-col">
      {/* this is the header */}
      <div className=" neutral-lowkey-bg flex   items-center p-8 ">
        <div className="flex items-center gap-4">
          <Avatar
            className="p-1"
            loading={!isLoaded}
            width_height={130}
            src={user?.profileImageUrl}
          />

          <div className="flex flex-col  gap-2">
            <p className="text-4xl  ">{`Welcome, ${
              user?.username || "user"
            }!!`}</p>
          </div>
        </div>
      </div>

      {/* this is the body */}
      <div className="flex flex-col  gap-12 p-10 py-10">
        {/* playlists should get filtered when clicked on view more */}
        {/* the reason i didnt reuse the .map function is because I lose typesafety. as different APIS return different objects */}
        <Section loading={playlistsLoading} name="Playlists">
          {
            /* {playlists && playlists.length > 0 ? (
            playlists.map((playlist) => {
              return (
                <SectionCard
                  href={`/${playlist.authorName}/${playlist.name}`}
                  pictureUrl={playlist.pictureUrl}
                  title={playlist.name}
                  key={playlist.id}
                />
              );

              <></>
            }) */ <></>
          }
          <p className="flex w-full items-center justify-center p-5 text-sm font-medium text-neutral-500 ">
            No playlists found
          </p>
        </Section>

        <Divider />

        <Section loading={playlistsLoading} name="Songs">
          <p className="flex w-full items-center justify-center p-5  text-sm text-neutral-500 ">
            No songs found
          </p>
        </Section>

        <Divider />

        <Section loading={playlistsLoading} name="Favourited playlists">
          <p className="flex w-full items-center justify-center p-5  text-sm text-neutral-500 ">
            No playlists found
          </p>
        </Section>

        <Divider />

        <Section loading={playlistsLoading} name="Favourited songs">
          <p className="flex w-full items-center justify-center p-5  text-sm text-neutral-500 ">
            No playlists found
          </p>
        </Section>

        {/* <Section loading={playlistsLoading} name="Songs" />

    <Section loading={playlistsLoading} name="Favourited playlists" />

    <Section loading={playlistsLoading} name="Favourited songs" /> */}
      </div>
    </div>
  );
};

export default Home;
