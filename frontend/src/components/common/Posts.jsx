import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType , username, userId}) => {
  const getPostEndPoints = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/followingposts";
      case "posts":
        return `/api/posts/userposts/${username}`;
      case "likes":
        return `/api/posts/likedpost/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POSTS_END_POINT = getPostEndPoints();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        // const isLoading = false;
        const response = await fetch(POSTS_END_POINT);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        // const isLoading = true;
        throw new Error(error);
      }
    },
    staleTime: 60000, // 1 minute stale time
    cacheTime: 300000, // 5 minutes cache time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch,username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
