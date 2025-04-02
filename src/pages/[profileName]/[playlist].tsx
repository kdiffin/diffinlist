import { useUser } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { matchSorter } from "match-sorter";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdAdd, MdSearch } from "react-icons/md";
import { Section, SectionCard } from "~/components/Section";
import CreateSong from "~/components/song/CreateSong";
import Input from "~/components/ui/Input";
import { ImageSkeleton } from "~/components/ui/Skeletons";
import { ssgHelper } from "~/server/helpers/generateSSGHelper";
import { validQuery } from "~/server/helpers/validateQuery";
import { api } from "~/utils/api";

// ui is very similar to profileName, so I copy pasted that component.
// I could have made the ui a component and the data fetching parts hooks, but I dont like abstracting such large files.

function Profile({
  profileName,
  playlistName,
}: {
  profileName: string;
  playlistName: string;
}) {
  const router = useRouter();
  const { user } = useUser();

  //the usequery will never hit loading because of ssg
  //also trpc uses react query under the hood
  const { data: playlist } = api.playlist.getPlaylist.useQuery({
    playlistName: playlistName,
    profileName: profileName,
  });

  const { data, isLoading: songsLoading } =
    api.playlist.getPlaylistWithSongs.useQuery({
      playlistName: playlistName,
      profileName: profileName,
    });

  if (!playlist) throw new Error("couldnt find playlist");

  const validSearch = validQuery(router.query.search);
  const songs = matchSorter(data ? data : [], validSearch ? validSearch : "", {
    keys: ["name"],
  });

  function filterSongs(value: string) {
    const url = {
      pathname: router.route,
      query: { ...router.query, search: value },
    };

    void router.replace(url, undefined, { shallow: true });
  }

  return (
    <>
      <div className=" flex-col">
        {/* this is the header */}
        <div className=" neutral-lowkey-bg flex items-center   justify-between p-8 ">
          <div className="flex items-center  gap-6">
            {playlist.pictureUrl ? (
              <div className="h-[130px] w-[130px]">
                <img
                  alt={playlist.name}
                  width={130}
                  height={130}
                  className=" h-full  w-full rounded-sm object-cover"
                  src={playlist.pictureUrl}
                />
              </div>
            ) : (
              <ImageSkeleton className="h-[130px] w-[130px]" />
            )}

            <div className="flex flex-col gap-2  ">
              <h1 className="text-4xl">{playlistName}</h1>
              <div className="text-sm">
                {playlist.genre ? (
                  <p className=" text-neutral-400">
                    Aesthetic / genre : {playlist.genre}
                  </p>
                ) : (
                  <></>
                )}

                <Link
                  href={`/${playlist.authorName}`}
                  className=" text-neutral-400"
                >
                  Author : {playlist.authorName}
                </Link>
              </div>
            </div>
          </div>

          {/* add ternary checking if ur author */}
        </div>

        {/* this is the body */}
        <div className="flex flex-col  gap-12 p-10 py-10">
          <Section
            showMoreHref={undefined}
            hideShowMore={true}
            loading={songsLoading}
            title={
              <>
                <p>Songs</p>
                <Input
                  icon={<MdSearch color=" #A3A3A3" />}
                  placeholder="Search song"
                  type="text"
                  value={router.query?.search as string}
                  className=" w-full max-w-lg !px-6 !py-3 !text-sm   xl:max-w-md "
                  setValue={(value: string) => filterSongs(value)}
                />
              </>
            }
          >
            <>
              {songs && songs.length > 0
                ? songs.map((song) => {
                    return (
                      <SectionCard
                        data={{
                          pictureUrl: song.pictureUrl,
                          authorName: song.authorName,
                          genre: song.genre,
                          songId: song.id,
                          playlistName: song.playlistName,
                          songName: song.name,
                        }}
                        type="song"
                        key={song.id}
                      />
                    );
                  })
                : !(user?.username === playlist.authorName) && (
                    <div className="flex h-[50vh] w-full items-center justify-center  text-center   text-lg font-semibold italic text-neutral-700">
                      No songs found
                    </div>
                  )}
            </>

            {user?.username === playlist.authorName && (
              <Link
                href={{
                  pathname: router.route,
                  query: {
                    ...router.query,
                    showCreateSong: "true",
                  },
                }}
                shallow
                className={` neutral-lowkey-bg  relative flex   flex-col items-center gap-2 p-4
            focus-within:bg-neutral-700/50 hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50`}
              >
                <div
                  className="flex   h-[150px] w-[150px]  items-center justify-center  rounded-sm border-2
  border-dotted border-neutral-700 text-center text-neutral-400
 "
                >
                  <MdAdd size={32} />
                </div>
                <p>Add Song</p>
              </Link>
            )}
          </Section>
        </div>

        {/* this component gets its open and close logic through query params */}
        <CreateSong />
      </div>

      <Head>
        {/* Primary Meta Tags  */}
        <title>{`${playlist.name} | ${playlist.authorName}`}</title>
        <meta
          name="title"
          content={`${playlist.name} | ${playlist.authorName}`}
        />
        <link rel="icon" href={playlist.pictureUrl} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta
          property="og:url"
          content={`https://diffinlist.vercel.app/${playlist.authorName}/${playlist.name}`}
        />
        <meta
          property="og:title"
          content={`${playlist.name} | ${playlist.authorName}`}
        />

        <meta property="og:img" content={playlist.pictureUrl} />

        {/* <!-- Twitter -- /> */}
        <meta property="twitter:card" content={playlist.pictureUrl} />
        <meta
          property="twitter:url"
          content={`https://diffinlist.vercel.app/${playlist.authorName}/${playlist.name}`}
        />
        <meta
          property="twitter:title"
          content={`${playlist.name} | ${playlist.authorName}`}
        />

        <meta property="twitter:img" content={playlist.pictureUrl}></meta>
      </Head>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileName = context.params?.profileName as string;
  const searchQueryPlaylistName = context.params?.playlist as string;

  const ssg = ssgHelper;

  if (!searchQueryProfileName)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  if (!searchQueryPlaylistName)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  await ssg.playlist.getPlaylist.prefetch({
    profileName: searchQueryProfileName,
    playlistName: searchQueryPlaylistName,
  });

  return {
    props: {
      //ngl this is a weird pattern
      //but what it does is basically it allows us to fetch from trpc while still having the benefits of ssg
      //we have to pass the context again down as props and then pass it on to the usequery
      trpcState: ssg.dehydrate(),
      profileName: searchQueryProfileName,
      playlistName: searchQueryPlaylistName,
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
