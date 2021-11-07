import React, { useEffect } from "react";
import { Card, Avatar } from "antd";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import {
  QueryClient,
  dehydrate,
  useQuery,
  useInfiniteQuery,
} from "react-query";
import { loadMyInfoAPI, loadUserAPI } from "../../apis/user";
import { loadPostsAPI, loadUserPostsAPI } from "../../apis/post";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import User from "../../interfaces/user";
import { GetStaticPropsContext } from "next";
import { useInView } from "react-intersection-observer";
import Post from "../../interfaces/post";

const UserPosts = () => {
  const router = useRouter();
  const [ref, inView] = useInView();
  const { id } = router.query; //next 다이나믹 라우팅으로 특정 사용자id값을 query로 가져올 수 있다
  const { data: me } = useQuery<User>("user", loadMyInfoAPI);
  const { data: userInfo } = useQuery<User, AxiosError>(["user", id], () =>
    loadUserAPI(Number(id))
  );
  const { data, isLoading, fetchNextPage } = useInfiniteQuery<Post[]>(
    "posts",
    ({ pageParam = "" }) => loadPostsAPI(pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.[lastPage.length - 1]?.id;
      },
    }
  );

  // console.log("data", data);
  const mainPosts = data?.pages.flat();
  const isEmpty = data?.pages[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data.pages[data.pages.length - 1]?.length < 10);
  const hasMorePosts = !isEmpty || !isReachingEnd;
  const readToLoad = hasMorePosts && !isLoading;

  useEffect(() => {
    console.log("inView", inView);
    inView && readToLoad && fetchNextPage();
  }, [inView, readToLoad, fetchNextPage]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>{userInfo.nickname}님의 글</title>
          <meta
            name="description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:title"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:image"
            content="https://ymillonga.com/favicon.ico"
          />
          <meta
            property="og:url"
            content={`https://ymillonga.com/user/${id}`}
          />
        </Head>
      )}
      {userInfo && userInfo.id !== me?.id ? (
        <Card
          style={{ marginBottom: 20 }}
          actions={[
            <div key="twit">
              게시글
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname?.[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div
        ref={readToLoad ? ref : undefined}
        style={{ height: 50, backgroundColor: "yellow" }}
      />
    </AppLayout>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const queryClient = new QueryClient();
  const id = context.params?.id as string;

  console.log("id", id);
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  // await queryClient.prefetchQuery(["user", id], () => loadUserPostsAPI(Number(id)));
  await queryClient.prefetchInfiniteQuery(["user", id], () =>
    loadUserPostsAPI(Number(id))
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      //       error - SerializableError: Error serializing `.dehydratedState.queries[0].state.data.pageParams[0]` returned from `getStaticProps` in "/user/[id]".
      // Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value.
    },
  };
};

export default UserPosts;
