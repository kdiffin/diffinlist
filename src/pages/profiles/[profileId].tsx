import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import React from "react";
import Avatar from "~/components/Avatar";
import { ssgHelper } from "~/server/helpers/generateSSGHelper";
import { api } from "~/utils/api";

function Profile({ profileId }: { profileId: string }) {
  //the usequery will never hit loading because of ssg
  const { data, isLoading } = api.profile.getProfileByProfileId.useQuery({
    profileId: profileId,
  });

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!data) throw new Error("Data not found");

  return (
    <>
      <Head>
        <title>{data.username}'s profile</title>
      </Head>
      <div>
        {data.username}
        <Avatar width_height={150} src={data.profileImageUrl} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const searchQueryProfileId = context.params?.profileId as string;
  const ssg = ssgHelper;

  if (!searchQueryProfileId)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No params found",
    });

  await ssg.profile.getProfileByProfileId.prefetch({
    profileId: searchQueryProfileId,
  });

  console.log(searchQueryProfileId);

  return {
    props: {
      //ngl this is a weird pattern
      //but what it does is basically it allows us to fetch from trpc while still having the benefits of ssg
      //we have to pass the context again down as props and then pass it on to the usequery
      trpcState: ssg.dehydrate(),
      profileId: searchQueryProfileId,
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
