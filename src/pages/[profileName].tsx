import { useUser } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Section, SectionCard } from "~/components/Section";
import Avatar from "~/components/ui/Avatar";
import Divider from "~/components/ui/Divider";
import useAdd from "~/hooks/useAdd";
import { ssgHelper } from "~/server/helpers/generateSSGHelper";
import { api } from "~/utils/api";

function Profile({ profileName }: { profileName: string }) {
  //the usequery will never hit loading because of ssg
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { data: userData } = api.profile.getProfileByProfileName.useQuery({
    profileName: profileName,
  });
  const username = userData ? userData.username : "";

  const { data: playlists, isLoading: playlistsLoading } =
    api.playlist.getPlaylists.useQuery({
      profileName: profileName,
      takeLimit: 8,
    });

  const { data: songs, isLoading: songsLoading } =
    api.song.getSongsByProfileName.useQuery({
      profileName: profileName,
      takeLimit: 8,
    });

  const { addPlaylist, addSong } = useAdd();

  if (!userData) throw new Error("Data not found");

  return (
    <>
      <div className=" flex-col">
        {/* this is the header */}

        <div className=" neutral-lowkey-bg flex   items-center p-8 ">
          <div className="flex items-center gap-4">
            <Avatar
              className="p-1"
              loading={false}
              width_height={130}
              src={userData.profileImageUrl}
            />

            <div className="flex flex-col  gap-2">
              <h1 className="text-4xl  ">{userData.username}</h1>
              <p className=" text-neutral-400">
                This user has {playlists ? playlists.length : "no"} playlist
                {playlists && playlists.length !== 1 ? "s" : ""}
              </p>
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
                authorName: username,
              },
            }}
            loading={playlistsLoading}
            title="Playlists"
          >
            {playlists && playlists.length > 0 ? (
              playlists.map((playlist) => {
                const playlistName = encodeURIComponent(playlist.name);

                return (
                  <SectionCard
                    type="playlist"
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
            loading={songsLoading}
            showMoreHref={{
              pathname: "/search",
              query: {
                results: "songs",
                authorName: username,
              },
            }}
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
        </div>
      </div>

      <Head>
        {/* Primary Meta Tags  */}
        <title>{`${userData.username} `}</title>
        <meta title="title" content={`${userData.username} | ${profileName}`} />
        <link rel="icon" href={userData.profileImageUrl} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta
          property="og:url"
          content={`https://diffinlist.vercel.app/${userData.username}`}
        />
        <meta
          property="og:title"
          content={`${userData.username} | ${profileName}`}
        />

        <meta property="og:image" content={userData.profileImageUrl} />

        {/* <!-- Twitter -- /> */}
        <meta property="twitter:card" content={userData.profileImageUrl} />
        <meta
          property="twitter:url"
          content={`https://diffinlist.vercel.app/${profileName}/${userData.username}`}
        />
        <meta
          property="twitter:title"
          content={`${userData.username} | ${profileName}`}
        />

        <meta
          property="twitter:image"
          content={userData.profileImageUrl}
        ></meta>
      </Head>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileName = context.params?.profileName as string;
  const ssg = ssgHelper;

  if (!searchQueryProfileName)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  await ssg.profile.getProfileByProfileName.prefetch({
    profileName: searchQueryProfileName,
  });

  return {
    props: {
      //ngl this is a weird pattern
      //but what it does is basically it allows us to fetch from trpc while still having the benefits of ssg
      //we have to pass the context again down as props and then pass it on to the usequery
      trpcState: ssg.dehydrate(),
      profileName: searchQueryProfileName,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Profile;
